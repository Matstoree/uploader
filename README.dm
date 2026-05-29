# FileUp — Simple File Uploader

Upload semua jenis file, tanpa login, tanpa expiry.

## Stack
- Next.js 14
- Vercel Blob (penyimpanan permanen)
- Busboy (multipart parser)

## Deploy ke Vercel

### 1. Push ke GitHub
```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/USERNAME/fileup.git
git push -u origin main
```

### 2. Buat Blob Store di Vercel
1. Buka [vercel.com](https://vercel.com) → Dashboard
2. Buat project baru, import repo GitHub kamu
3. Setelah deploy, buka tab **Storage**
4. Klik **Create** → pilih **Blob**
5. Beri nama (misal: `fileup-storage`)
6. Klik **Connect to Project** → pilih project kamu

Vercel otomatis menambahkan env `BLOB_READ_WRITE_TOKEN` ke project.

### 3. Redeploy
Setelah blob terhubung, klik **Redeploy** di dashboard Vercel.

Selesai! Website kamu siap di:
```
https://nama-project.vercel.app
```

## API

```
POST /api/upload
Content-Type: multipart/form-data

field: file
```

Response:
```json
{ "status": true, "url": "https://..." }
```

## Lokal

```bash
npm install
# Tambahkan BLOB_READ_WRITE_TOKEN ke .env.local
npm run dev
```
