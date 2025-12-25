export interface UploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  size?: number;
  message?: string;
  error?: string;
}

export interface FileInfo {
  name: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
}
