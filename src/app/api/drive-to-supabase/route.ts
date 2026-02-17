import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* -------------------------------------------------------------------------- */
/*                                   CONFIG                                   */
/* -------------------------------------------------------------------------- */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY!;
const BUCKET = process.env.SUPABASE_BUCKET!;
const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB ?? 50);
const MAX_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

const EVENT_FOLDERS: Record<string, string> = {
  Event: "11_n5zk4b03lPRDugixq2NMuBxKwAnaG4",
  Graduation: "1IHi8o4-PaZQQYWqWQRh0-9rbRZQWKAYP",
  Wedding: "1s6bUD2tq_MKjLsAYomPaEpJiZOOaVUX2",
};

const VALID_CATEGORIES = ["foto", "video"] as const;
type Category = (typeof VALID_CATEGORIES)[number];

interface DriveFile {
  id: string;
  name: string;
  mimeType?: string;
  size?: string;
}

/* -------------------------------------------------------------------------- */
/*                               DRIVE HELPERS                                 */
/* -------------------------------------------------------------------------- */

async function listDriveFiles(folderId: string): Promise<DriveFile[]> {
  const files: DriveFile[] = [];
  let pageToken = "";

  do {
    const url =
      `https://www.googleapis.com/drive/v3/files` +
      `?q='${folderId}'+in+parents` +
      `&fields=nextPageToken,files(id,name,mimeType,size)` +
      `&pageSize=100` +
      (pageToken ? `&pageToken=${pageToken}` : "") +
      `&key=${DRIVE_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.files) files.push(...(data.files as DriveFile[]));
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return files;
}

async function downloadDriveFile(
  fileId: string,
  fileName: string
): Promise<Uint8Array | null> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${DRIVE_API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    console.warn(
      `⚠️ Skipped (download failed): ${fileName} [${res.status}]`
    );
    return null;
  }

  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}


/* -------------------------------------------------------------------------- */
/*                             SUPABASE HELPERS                                */
/* -------------------------------------------------------------------------- */

async function fileExists(
  event: string,
  fileName: string
) {
  const { data } = await supabase
    .from("event_files")
    .select("id")
    .eq("event_name", event)
    .eq("file_name", fileName)
    .maybeSingle();

  return Boolean(data);
}

async function uploadToSupabase(
  path: string,
  file: Uint8Array,
  mimeType: string
) {
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: mimeType,
    upsert: false, // ❗ never overwrite corrupted files
  });

  if (error) {
    throw error;
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/* -------------------------------------------------------------------------- */
/*                               SYNC LOGIC                                   */
/* -------------------------------------------------------------------------- */

async function syncCategory(
  eventName: string,
  category: Category,
  folderId: string
) {
  const files = await listDriveFiles(folderId);

  for (const file of files) {
    const size = Number(file.size ?? 0);

    // 1️⃣ Skip duplicates
    if (await fileExists(eventName, file.name)) {
      console.log(`⏩ Skipped (exists): ${file.name}`);
      continue;
    }

    // 2️⃣ Skip large files BEFORE download
    if (size > MAX_BYTES) {
      console.warn(
        `⚠️ Skipped (too large): ${file.name} (${(
          size /
          1024 /
          1024
        ).toFixed(1)}MB)`
      );
      continue;
    }

    console.log(`⬇️ Downloading: ${file.name}`);

    const binary = await downloadDriveFile(file.id, file.name);
    if (!binary) {
      console.error(`❌ Failed to download: ${file.name}`);
      continue;
    }

    // 3️⃣ Sanity check (prevents corruption)
    if (binary.byteLength !== size) {
      console.error(
        `❌ Size mismatch: ${file.name} (Drive ${size}, Download ${binary.byteLength})`
      );
      continue;
    }

    const path = `${eventName}/${category}/${file.name}`;

    console.log(`⬆️ Uploading: ${path}`);

    try {
      const publicUrl = await uploadToSupabase(
        path,
        binary,
        file.mimeType ?? "application/octet-stream"
      );

      const { error: insertError } = await supabase.from("event_files").insert({
        event_name: eventName,
        file_name: file.name,
        file_url: publicUrl,
      });

      if (insertError) {
        // Handle duplicate database entries (PostgreSQL unique constraint violation)
        if (
          insertError.code === '23505' ||
          insertError.message?.toLowerCase().includes('duplicate') ||
          insertError.message?.toLowerCase().includes('already exists')
        ) {
          console.log(`⏩ Skipped (duplicate in DB): ${file.name}`);
          continue;
        }
        throw insertError;
      }

      console.log(`✅ Synced: ${file.name}`);
    } catch (error: unknown) {
      // Handle duplicate storage files (409) or other upload errors
      const err = error as { statusCode?: string | number; error?: string; message?: string };
      const isDuplicate =
        err.statusCode === '409' ||
        err.statusCode === 409 ||
        err.error === 'Duplicate' ||
        err.message?.toLowerCase().includes('already exists') ||
        err.message?.toLowerCase().includes('duplicate') ||
        err.message?.toLowerCase().includes('the resource already exists');

      if (isDuplicate) {
        console.log(`⏩ Skipped (duplicate): ${file.name}`);
        continue;
      }
      // Re-throw other errors
      throw error;
    }
  }
}

async function syncEvent(eventName: string, rootFolderId: string) {
  console.log(`📂 Processing event: ${eventName}`);

  const subFolders = await listDriveFiles(rootFolderId);

  for (const folder of subFolders) {
    const category = folder.name.toLowerCase() as Category;
    if (!VALID_CATEGORIES.includes(category)) continue;

    await syncCategory(eventName, category, folder.id);
  }
}

/* -------------------------------------------------------------------------- */
/*                                   ROUTE                                    */
/* -------------------------------------------------------------------------- */

export async function GET() {
  try {
    if (!BUCKET) throw new Error("SUPABASE_BUCKET not set");

    for (const [eventName, folderId] of Object.entries(EVENT_FOLDERS)) {
      await syncEvent(eventName, folderId);
    }

    return NextResponse.json({
      success: true,
      message: "Drive → Supabase sync completed safely",
    });
  } catch (err: unknown) {
    console.error("❌ Sync failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
