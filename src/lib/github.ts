import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || 'main';

export async function uploadFileToGitHub(
  filename: string,
  content: Buffer
): Promise<string> {
  try {
    const base64Content = content.toString('base64');
    const path = `uploads/${Date.now()}-${filename}`;

    // Upload file to GitHub
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Upload: ${filename}`,
      content: base64Content,
      branch,
    });

    // Return raw GitHub URL
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    return rawUrl;
  } catch (error: any) {
    console.error('GitHub upload error:', error);
    throw new Error(`Failed to upload to GitHub: ${error.message}`);
  }
}

export async function getFileFromGitHub(filename: string): Promise<Buffer | null> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: `uploads/${filename}`,
      ref: branch,
    });

    if ('content' in data && data.content) {
      return Buffer.from(data.content, 'base64');
    }
    return null;
  } catch (error) {
    console.error('GitHub fetch error:', error);
    return null;
  }
}

export async function listFiles(): Promise<any[]> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'uploads',
      ref: branch,
    });

    if (Array.isArray(data)) {
      return data.map(file => ({
        name: file.name,
        size: file.size,
        url: file.download_url,
        sha: file.sha,
      }));
    }
    return [];
  } catch (error) {
    console.error('List files error:', error);
    return [];
  }
}
