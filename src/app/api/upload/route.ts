import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToGitHub } from '@/lib/github';
import { checkRateLimit, getRateLimitInfo } from '@/lib/rate-limit';
import { validateFile, sanitizeFilename } from '@/lib/utils';
import { UploadResponse } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
  
  // Rate limiting
  if (!checkRateLimit(clientIp, 10, 60000)) {
    const rateLimitInfo = getRateLimitInfo(clientIp);
    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((rateLimitInfo.reset - Date.now()) / 1000),
      } as UploadResponse,
      { 
        status: 429,
        headers: {
          'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
          'X-RateLimit-Reset': rateLimitInfo.reset.toString(),
        }
      }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' } as UploadResponse,
        { status: 400 }
      );
    }

    // Validate file
    const validationError = validateFile(file, Number(process.env.MAX_FILE_SIZE));
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError } as UploadResponse,
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Sanitize filename
    const sanitizedFilename = sanitizeFilename(file.name);

    // Upload to GitHub
    const githubUrl = await uploadFileToGitHub(sanitizedFilename, buffer);

    // Return success response
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const publicUrl = `${appUrl}/file/${sanitizedFilename}`;

    const rateLimitInfo = getRateLimitInfo(clientIp);

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename: sanitizedFilename,
        size: file.size,
        message: 'File uploaded successfully',
      } as UploadResponse,
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
          'X-RateLimit-Reset': rateLimitInfo.reset.toString(),
        }
      }
    );
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Upload failed',
      } as UploadResponse,
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'File upload API',
    endpoint: '/api/upload',
    method: 'POST',
    maxFileSize: '100MB',
  });
}
