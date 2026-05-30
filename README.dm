# FileDrop — File Uploader

Upload any file, get a short permanent URL. No login required.

## Features

- Upload any file type (image, video, audio, PDF, ZIP, etc.)
- No login / no auth
- Short URL: `/file/{id}.{ext}`
- Permanent storage via Vercel Blob
- REST API

## Routes

| Route | Description |
|---|---|
| `/` | Upload page |
| `/file/[id]` | Serve / redirect to file |
| `/docs` | API documentation |
| `POST /api/upload` | Upload endpoint |

---

## Deploy to Vercel (3 steps)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "init"
gh repo create fileuploader --public --push
```

### 2. Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or connect your GitHub repo at https://vercel.com/new

### 3. Enable Vercel Blob Storage

In your Vercel project dashboard:

1. Go to **Storage** tab
2. Click **Create Database** → select **Blob**
3. Name it (e.g., `files`) and click **Create**
4. Click **Connect to Project** and select your project
5. This auto-sets the `BLOB_READ_WRITE_TOKEN` env variable

**That's it!** Your uploader is live. ✓

---

## Local Development

```bash
npm install
vercel env pull .env.local   # pulls BLOB_READ_WRITE_TOKEN
npm run dev
```

## API Usage

### POST /api/upload

```bash
curl -X POST https://your-domain.vercel.app/api/upload \
  -F "file=@photo.jpg"
```

**Response:**
```json
{
  "status": true,
  "url": "https://your-domain.vercel.app/file/abc123.jpg"
}
```

### Node.js

```js
const axios = require("axios");
const FormData = require("form-data");

async function upload(buffer, filename) {
  const form = new FormData();
  form.append("file", buffer, filename);

  const { data } = await axios.post(
    "https://your-domain.vercel.app/api/upload",
    form,
    { headers: form.getHeaders() }
  );

  return data.url;
}
```

---

## Notes on Storage

- Files are stored permanently in **Vercel Blob** (no expiry)
- Vercel Blob free tier: 1 GB storage, 10 GB bandwidth/month
- For larger scale, upgrade to Vercel Pro or use a custom blob store
- The `/file/[id]` route redirects to the Vercel Blob CDN URL
