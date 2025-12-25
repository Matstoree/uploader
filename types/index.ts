export interface UploadResponse {
  success: boolean;
  url?: string;
  filename?: string;
  size?: number;
  message?: string;
  error?: string;
  retryAfter?: number;
}
