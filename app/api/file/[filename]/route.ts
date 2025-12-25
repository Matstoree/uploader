import { NextRequest, NextResponse } from 'next/server';
import { getFileFromGitHub } from '@/lib/github';

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const fileUrl = await getFileFromGitHub(params.filename);
    if (!fileUrl) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    return NextResponse.redirect(fileUrl, 302);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
}
