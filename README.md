# UploadX — Permanent Media Uploader

Website uploader media permanen berbasis Vercel Blob Storage. Gratis, no expiry.

## 📁 Struktur Project

```
media-uploader/
├── api/
│   ├── upload.js     → POST /api/upload
│   ├── files.js      → GET /api/files
│   └── delete.js     → DELETE /api/delete?url=...
├── public/
│   └── index.html    → UI website
├── vercel.json
├── package.json
└── README.md
```

## 🚀 Cara Deploy ke Vercel (Gratis)

### 1. Push ke GitHub
Upload semua file ini ke repositori GitHub kamu.

### 2. Import ke Vercel
- Buka [vercel.com](https://vercel.com) → Login
- Klik **New Project** → Import repo GitHub kamu
- Klik **Deploy**

### 3. Tambah Vercel Blob Storage
- Di Vercel Dashboard → tab **Storage**
- Klik **Create** → pilih **Blob**
- Pilih plan **Hobby (Gratis, limit 5GB)**
- Klik **Connect** ke project kamu
- Ini otomatis menambahkan env variable `BLOB_READ_WRITE_TOKEN`

### 4. (Opsional) Set API Key
Di Vercel → Project Settings → Environment Variables:
```
UPLOAD_API_KEY = rahasia-kamu-123
```
Jika tidak di-set, upload bebas tanpa auth.

### 5. Selesai!
Website kamu live di: `https://nama-project.vercel.app`

---

## 🤖 Integrasi Bot WhatsApp

```js
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const FormData = require('form-data');
const fetch = require('node-fetch');

const BASE_URL = 'https://nama-project.vercel.app';

async function uploadMedia(sock, msg) {
  const buffer = await downloadMediaMessage(msg, 'buffer', {});
  const mime = msg.message?.imageMessage?.mimetype || 'image/jpeg';
  const ext = mime.split('/')[1];

  const form = new FormData();
  form.append('file', buffer, { filename: `media.${ext}`, contentType: mime });

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: form,
    headers: form.getHeaders(),
  });

  const data = await res.json();
  return data.url; // Link permanen!
}

// Contoh penggunaan di handler pesan:
sock.ev.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0];
  if (msg.message?.imageMessage) {
    const url = await uploadMedia(sock, msg);
    await sock.sendMessage(msg.key.remoteJid, { text: `✅ Upload berhasil!\n${url}` });
  }
});
```

---

## 📡 API Reference

### POST /api/upload
Upload file (multipart/form-data)

**Request:**
```
Content-Type: multipart/form-data
x-api-key: (opsional)

file: <binary>
```

**Response:**
```json
{
  "success": true,
  "url": "https://blob.vercel-storage.com/xxx.jpg",
  "filename": "photo.jpg",
  "size": 204800,
  "type": "image/jpeg",
  "uploadedAt": "2024-01-01T12:00:00.000Z"
}
```

### GET /api/files
List semua file.

### DELETE /api/delete?url=...
Hapus file berdasarkan URL.
