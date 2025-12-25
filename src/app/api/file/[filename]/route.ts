import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const owner = process.env.GITHUB_OWNER!;
    const repo = process.env.GITHUB_REPO!;
    const branch = process.env.GITHUB_BRANCH || 'main';

    // Find the file in uploads directory
    const githubUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/uploads`;
    
    // Try to find the file (search by name pattern)
    const response = await fetch(`${githubUrl}/${filename}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Redirect to the raw GitHub URL
    const rawUrl = response.url;
    return NextResponse.redirect(rawUrl);
  } catch (error: any) {
    console.error('File retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve file' },
      { status: 500 }
    );
  }
}
