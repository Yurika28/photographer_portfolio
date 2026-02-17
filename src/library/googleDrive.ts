// lib/googleDrive.ts
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

export function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });

  return google.drive({ version: 'v3', auth });
}

// Call this ONCE to get all file IDs, then save to database
export async function getAllFilesFromFolder(folderId: string) {
  const drive = getDriveClient();
  
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType, size, createdTime)',
    pageSize: 1000, // Max per request
    orderBy: 'name',
  });

  return response.data.files?.map(file => ({
    googleDriveId: file.id!,
    title: file.name!,
    type: file.mimeType?.startsWith('Video/') ? 'Video' : 'Foto',
    size: file.size,
    createdAt: file.createdTime,
  })) || [];
}

// Script to fetch all files from all folders (run once)
export async function fetchAllMedia() {
  const folders = {
    wedding: 'WEDDING_FOLDER_ID',
    event: 'EVENT_FOLDER_ID', 
    graduation: 'GRADUATION_FOLDER_ID',
  };

  const allMedia = [];

  for (const [category, folderId] of Object.entries(folders)) {
    const files = await getAllFilesFromFolder(folderId);
    
    allMedia.push(...files.map((file, index) => ({
      id: `${category}-${index}`,
      category,
      ...file,
    })));
  }


  console.log('Total files:', allMedia.length);
  return allMedia;
}