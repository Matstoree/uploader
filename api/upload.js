// api/upload.js
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Optional API key check — set UPLOAD_API_KEY in Vercel env vars to enable
  const apiKey = process.env.UPLOAD_API_KEY;
  if (apiKey && req.headers['x-api-key'] !== vercel_blob_rw_ZMgNAvvlzqaNmR8l_CQCLXLaXg1HBHAfFkYebU3nynLA1ma) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  try {
    // Read raw body stream
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);

    // Parse multipart manually using content-type boundary
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Expected multipart/form-data' });
    }

    const boundary = contentType.split('boundary=')[1];
    if (!boundary) return res.status(400).json({ error: 'No boundary found' });

    const parts = parseMultipart(body, boundary);
    if (!parts.length) return res.status(400).json({ error: 'No files found' });

    const results = [];
    for (const part of parts) {
      if (!part.filename) continue;

      const ext = part.filename.split('.').pop().toLowerCase();
      const allowed = ['jpg','jpeg','png','gif','webp','svg','mp4','webm','mov','mp3','wav','ogg','pdf','zip','rar','txt','json'];
      if (!allowed.includes(ext)) {
        results.push({ error: `File type .${ext} not allowed`, filename: part.filename });
        continue;
      }

      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${part.filename}`;
      const blob = await put(uniqueName, part.data, {
        access: 'public',
        contentType: part.contentType || 'application/octet-stream',
      });

      results.push({
        success: true,
        filename: part.filename,
        url: blob.url,
        size: part.data.length,
        type: part.contentType,
        uploadedAt: new Date().toISOString(),
      });
    }

    if (results.length === 1) {
      return res.status(200).json(results[0]);
    }
    return res.status(200).json({ files: results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Upload failed', detail: err.message });
  }
}

function parseMultipart(buffer, boundary) {
  const parts = [];
  const sep = Buffer.from(`--${boundary}`);
  const end = Buffer.from(`--${boundary}--`);
  let pos = 0;

  while (pos < buffer.length) {
    const start = indexOf(buffer, sep, pos);
    if (start === -1) break;
    pos = start + sep.length + 2; // skip \r\n

    if (buffer.slice(start, start + end.length).equals(end)) break;

    const headerEnd = indexOf(buffer, Buffer.from('\r\n\r\n'), pos);
    if (headerEnd === -1) break;

    const headerStr = buffer.slice(pos, headerEnd).toString();
    pos = headerEnd + 4;

    const nextSep = indexOf(buffer, sep, pos);
    const dataEnd = nextSep === -1 ? buffer.length : nextSep - 2;
    const data = buffer.slice(pos, dataEnd);
    pos = nextSep;

    const dispMatch = headerStr.match(/Content-Disposition:.*name="([^"]+)"(?:.*filename="([^"]+)")?/i);
    const typeMatch = headerStr.match(/Content-Type:\s*(.+)/i);

    if (dispMatch) {
      parts.push({
        name: dispMatch[1],
        filename: dispMatch[2] || null,
        contentType: typeMatch ? typeMatch[1].trim() : null,
        data,
      });
    }
  }
  return parts;
}

function indexOf(buf, search, start = 0) {
  for (let i = start; i <= buf.length - search.length; i++) {
    if (buf.slice(i, i + search.length).equals(search)) return i;
  }
  return -1;
}
