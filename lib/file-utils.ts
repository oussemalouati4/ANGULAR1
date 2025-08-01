export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

export function getFileIcon(fileName: string, isFolder: boolean = false): string {
  if (isFolder) return 'folder';
  
  const extension = getFileExtension(fileName);
  
  const iconMap: Record<string, string> = {
    // Images
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    svg: 'image',
    webp: 'image',
    
    // Documents
    pdf: 'file-text',
    doc: 'file-text',
    docx: 'file-text',
    txt: 'file-text',
    
    // Spreadsheets
    xls: 'sheet',
    xlsx: 'sheet',
    csv: 'sheet',
    
    // Presentations
    ppt: 'presentation',
    pptx: 'presentation',
    
    // Code
    js: 'code',
    ts: 'code',
    jsx: 'code',
    tsx: 'code',
    html: 'code',
    css: 'code',
    json: 'code',
    
    // Archives
    zip: 'archive',
    rar: 'archive',
    '7z': 'archive',
    
    // Video
    mp4: 'video',
    avi: 'video',
    mov: 'video',
    
    // Audio
    mp3: 'music',
    wav: 'music',
    flac: 'music',
  };
  
  return iconMap[extension] || 'file';
}

export function getMimeType(fileName: string): string {
  const extension = getFileExtension(fileName);
  
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    txt: 'text/plain',
    json: 'application/json',
    mp4: 'video/mp4',
    mp3: 'audio/mpeg',
  };
  
  return mimeMap[extension] || 'application/octet-stream';
}

export function isImageFile(fileName: string): boolean {
  const extension = getFileExtension(fileName);
  return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension);
}

export function generateBreadcrumbs(path: string): Array<{ name: string; path: string }> {
  const parts = path.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Racine', path: '/' }];
  
  let currentPath = '';
  parts.forEach(part => {
    currentPath += `/${part}`;
    breadcrumbs.push({ name: part, path: currentPath });
  });
  
  return breadcrumbs;
}