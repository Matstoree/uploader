import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;
const branch = process.env.GITHUB_BRANCH || 'main';

export async function uploadFileToGitHub(filename: string, content: Buffer): Promise<string> {
  const base64 = content.toString('base64');
  const path = `uploads/${Date.now()}-${filename}`;

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: `Upload: ${filename}`,
    content: base64,
    branch,
  });

  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

export async function getFileFromGitHub(filename: string): Promise<string | null> {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: 'uploads', ref: branch });
    if (Array.isArray(data)) {
      const file = data.find(f => f.name.endsWith(filename));
      return file?.download_url || null;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
}
