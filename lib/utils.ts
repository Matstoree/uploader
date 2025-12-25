export function validateFile(file: File, maxSize: number = 104857600): string | null {
  if (!file) return 'No file provided';
  if (file.size > maxSize) return `File too large. Max: ${maxSize / 1024 / 1024}MB`;
  if (file.size === 0) return 'File is empty';

  const dangerous = ['.exe', '.bat', '.cmd', '.sh', '.com', '.scr'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  
  if (dangerous.includes(ext)) return 'File type not allowed';
  return null;
}

export function sanitizeFilename(filename: string): string {
  let clean = filename.replace(/\.\./g, '').replace(/[^a-zA-Z0-9._-]/g, '_');
  return clean.substring(0, 200);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded ? forwarded.split(',')[0].trim() : 'unknown';
}
