// api/delete.js
import { del } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  // API key required for delete
  const apiKey = process.env.UPLOAD_API_KEY;
  if (apiKey && req.headers['x-api-key'] !== apiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });

  try {
    await del(url);
    return res.status(200).json({ success: true, deleted: url });
  } catch (err) {
    return res.status(500).json({ error: 'Delete failed', detail: err.message });
  }
}
