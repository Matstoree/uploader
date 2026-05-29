// api/files.js
import { list } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { blobs } = await list();
    const files = blobs.map(b => ({
      url: b.url,
      filename: b.pathname,
      size: b.size,
      uploadedAt: b.uploadedAt,
    }));
    return res.status(200).json({ files, total: files.length });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list files', detail: err.message });
  }
}
