import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";
import type { Photo } from "@/library/getPhotos";
import ClientMasonryGrid from "@/components/ClientMasonryGrid"; 


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);



function PhotoGridSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto py-6">
      <div className="flex w-auto -ml-4">
        <div className="pl-4 bg-clip-padding flex-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-md mb-4 animate-pulse">
              <div className={`w-full bg-gray-200 ${
                i % 3 === 0 ? 'h-48' : i % 3 === 1 ? 'h-64' : 'h-56'
              }`}></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="pl-4 bg-clip-padding flex-1 hidden sm:block">
          {[...Array(3)].map((_, i) => (
            <div key={i + 3} className="rounded-xl overflow-hidden shadow-md mb-4 animate-pulse">
              <div className={`w-full bg-gray-200 ${
                (i + 1) % 3 === 0 ? 'h-56' : (i + 1) % 3 === 1 ? 'h-48' : 'h-64'
              }`}></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="pl-4 bg-clip-padding flex-1 hidden lg:block">
          {[...Array(3)].map((_, i) => (
            <div key={i + 6} className="rounded-xl overflow-hidden shadow-md mb-4 animate-pulse">
              <div className={`w-full bg-gray-200 ${
                (i + 2) % 3 === 0 ? 'h-64' : (i + 2) % 3 === 1 ? 'h-56' : 'h-48'
              }`}></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="pl-4 bg-clip-padding flex-1 hidden xl:block">
          {[...Array(3)].map((_, i) => (
            <div key={i + 9} className="rounded-xl overflow-hidden shadow-md mb-4 animate-pulse">
              <div className={`w-full bg-gray-200 ${
                (i + 3) % 3 === 0 ? 'h-48' : (i + 3) % 3 === 1 ? 'h-64' : 'h-56'
              }`}></div>
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MAX_FILE_SIZE =
  (Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB) || 5) * 1024 * 1024;

async function fetchEventPhotos(event: string, bucketName: string): Promise<Photo[]> {
  try {
    console.log(`Fetching photos from ${event}/foto...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const { data: files, error } = await supabase.storage
      .from(bucketName)
      .list(`${event}/foto`, {
        limit: 50,
        sortBy: { column: "name", order: "asc" },
      });

    clearTimeout(timeoutId);

    if (error) {
      console.error(`Error fetching ${event} photos:`, error.message);
      return [];
    }

    if (!files || files.length === 0) {
      console.log(`No files found in ${event}/foto`);
      return [];
    }

    const imageFiles = files.filter((file) => {
      const ext = file.name.toLowerCase();
      const isImage =
        ext.endsWith(".jpg") ||
        ext.endsWith(".jpeg") ||
        ext.endsWith(".png") ||
        ext.endsWith(".webp") ||
        ext.endsWith(".gif");

      const fileSize = file.metadata?.size ?? 0;
      const isWithinLimit = fileSize <= MAX_FILE_SIZE;

      if (isImage && !isWithinLimit) {
        console.warn(
          `⛔ Skipping large file: ${file.name} (${(fileSize / (1024 * 1024)).toFixed(2)} MB)`
        );
      }

      return isImage && isWithinLimit;
    });

    if (imageFiles.length === 0) {
      console.log(`No image files found in ${event}/foto`);
      return [];
    }

    const shuffled = imageFiles.sort(() => Math.random() - 0.5);

    console.log(`Selected ${shuffled.length} valid photos from ${event}`);

    return shuffled.map((file) => {
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(`${event}/foto/${file.name}`);

      return {
        id: `${event}/foto/${file.name}`,
        url: data.publicUrl,
        name: file.name,
        category: event.toLowerCase() as Photo["category"],
      };
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.error(`Timeout fetching ${event} photos`);
    } else {
      console.error(`Error processing ${event}:`, err);
    }
    return [];
  }
}



export default async function PhotoList() {
  const bucketName = "event_files";
  const eventFolders = ["Event", "Graduation", "Wedding"];
  
  let allPhotos: Photo[] = [];
  const fetchErrors: string[] = [];

  console.log('Starting to fetch photos from all events...');

  try {
    // Process folders in parallel for better performance
    const photoPromises = eventFolders.map(async (event) => {
      try {
        const photos = await fetchEventPhotos(event, bucketName);
        console.log(`✓ ${event}: ${photos.length} photos loaded`);
        return photos;
      } catch (error) {
        const errorMsg = `Failed to load ${event}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        fetchErrors.push(errorMsg);
        return [];
      }
    });

    // Wait for all promises to resolve
    const photoArrays = await Promise.all(photoPromises);
    allPhotos = photoArrays.flat();

    console.log(`Total photos loaded: ${allPhotos.length}`);

  } catch (error) {
    console.error('Error in main fetch process:', error);
    fetchErrors.push(`Main process error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Final shuffle for more randomness
  allPhotos = allPhotos.sort(() => Math.random() - 0.5);

  
  if (process.env.NODE_ENV === 'development') {
    console.log('Fetch summary:', {
      totalPhotos: allPhotos.length,
      errors: fetchErrors,
      eventCounts: eventFolders.map(event => ({
        event,
        count: allPhotos.filter(p => p.category === event).length
      }))
    });
  }

  // Handle empty state
  if (allPhotos.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12">
        <div className="text-center text-gray-500">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
            <p className="text-sm mb-4">
              Check if photos exist in bucket &quot;{bucketName}&quot; under folders: {eventFolders.join(', ')}
            </p>
            {fetchErrors.length > 0 && (
              <div className="text-xs text-red-500 mt-4 p-3 bg-red-50 rounded-lg">
                <p className="font-medium mb-2">Errors encountered:</p>
                <ul className="text-left space-y-1">
                  {fetchErrors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<PhotoGridSkeleton />}>
        <ClientMasonryGrid photos={allPhotos} />
      </Suspense>
    </>
  );
}