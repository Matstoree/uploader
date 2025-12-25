import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToGitHub } from '@/lib/github';
import { checkRateLimit, getRateLimitInfo } from '@/lib/rate-limit';
import { validateFile, sanitizeFilename, getClientIp } from '@/lib/utils';
import { UploadResponse } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  
  if (!checkRateLimit(clientIp, 10, 60000)) {
    const info = getRateLimitInfo(clientIp);
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded', retryAfter: Math.ceil((info.reset - Date.now()) / 1000) } as UploadResponse,
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' } as UploadResponse, { status: 400 });
    }

    const validationError = validateFile(file, Number(process.env.MAX_FILE_SIZE || 104857600));
    if (validationError) {
      return NextResponse.json({ success: false, error: validationError } as UploadResponse, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = sanitizeFilename(file.name);

    await uploadFileToGitHub(filename, buffer);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const publicUrl = `${appUrl}/file/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      message: 'File uploaded successfully',
    } as UploadResponse);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Upload failed' } as UploadResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'File Upload API', endpoint: '/api/upload', method: 'POST' });
}
