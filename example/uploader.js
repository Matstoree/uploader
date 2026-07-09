/**
 * Klien Node.js untuk uploader ini — tanpa dependency tambahan.
 * Butuh Node.js 18+ (sudah punya fetch, FormData, Blob bawaan).
 *
 * Cocok ditempel langsung ke bot WhatsApp (Baileys, whatsapp-web.js, dll)
 * karena cuma butuh Buffer hasil download media, tidak perlu simpan ke disk.
 *
 * Cara pakai:
 *   const { uploadBuffer, uploadFile } = require("./uploader");
 *   const url = await uploadBuffer(buffer, "foto.jpg");
 */

const BASE_URL = process.env.UPLOADER_URL || "https://your-domain.vercel.app";

/**
 * Upload dari Buffer (paling umum dipakai bot: hasil download media WhatsApp).
 * @param {Buffer} buffer - isi file
 * @param {string} filename - nama file, dipakai untuk menentukan ekstensi (mis. "video.mp4")
 * @returns {Promise<string>} URL pendek file yang sudah diupload
 */
async function uploadBuffer(buffer, filename) {
  const form = new FormData();
  form.append("file", new Blob([buffer]), filename);

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  if (!data.status) throw new Error(data.error || "Upload gagal");
  return data.url;
}

/**
 * Upload dari path file di disk.
 * @param {string} filePath
 * @returns {Promise<string>} URL pendek file yang sudah diupload
 */
async function uploadFile(filePath) {
  const fs = require("fs");
  const path = require("path");
  const buffer = fs.readFileSync(filePath);
  return uploadBuffer(buffer, path.basename(filePath));
}

module.exports = { uploadBuffer, uploadFile };
