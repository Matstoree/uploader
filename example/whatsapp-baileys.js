/**
 * Contoh integrasi ke bot WhatsApp berbasis Baileys (@whiskeysockets/baileys).
 * Alur: user kirim media -> bot download -> upload ke uploader -> balas dengan link.
 *
 * Jalankan: npm install @whiskeysockets/baileys
 * Set env UPLOADER_URL ke domain uploader-mu, misal:
 *   UPLOADER_URL=https://your-domain.vercel.app node examples/whatsapp-baileys.js
 */

const {
  default: makeWASocket,
  useMultiFileAuthState,
  downloadMediaMessage,
} = require("baileys");
const { uploadBuffer } = require("./uploader");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const sock = makeWASocket({ auth: state });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    // Cek apakah pesan mengandung media (gambar, video, dokumen, dst.)
    const mediaType = Object.keys(msg.message).find((k) =>
      ["imageMessage", "videoMessage", "documentMessage", "audioMessage"].includes(k)
    );
    if (!mediaType) return;

    const from = msg.key.remoteJid;

    try {
      // 1. Download media jadi Buffer (tidak perlu simpan ke disk)
      const buffer = await downloadMediaMessage(msg, "buffer", {});

      // 2. Tentukan nama file dari mimetype
      const mime = msg.message[mediaType].mimetype || "application/octet-stream";
      const ext = mime.split("/")[1]?.split(";")[0] || "bin";
      const filename = `upload.${ext}`;

      // 3. Upload dan dapat link pendek
      const url = await uploadBuffer(buffer, filename);

      // 4. Balas ke user
      await sock.sendMessage(from, { text: `File berhasil diupload:\n${url}` });
    } catch (err) {
      await sock.sendMessage(from, { text: `Upload gagal: ${err.message}` });
    }
  });
}

startBot();
