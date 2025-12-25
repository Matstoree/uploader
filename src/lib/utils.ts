export function validateFile(file: File, maxSize: number = 104857600): string | null {
  if (!file) {
    return 'No file provided';
  }

  if (file.size > maxSize) {
    return `File too large. Max size: ${maxSize / 1024 / 1024}MB`;
  }

  // Check for dangerous file extensions
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.com', '.scr'];
  const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  
  if (dangerousExtensions.includes(extension)) {
    return 'File type not allowed for security reasons';
  }

  return null;
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
