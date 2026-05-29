import { put } from "@vercel/blob";
import Busboy from "busboy";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ status: false, error: "Method not allowed" });

  try {
    const { filename, buffer } = await parseFile(req);
    const blob = await put(filename, buffer, { access: "public" });
    res.json({ status: true, url: blob.url });
  } catch (e) {
    res.status(500).json({ status: false, error: e.message });
  }
}

function parseFile(req) {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: req.headers });
    let result = null;

    bb.on("file", (field, stream, info) => {
      const chunks = [];
      stream.on("data", (d) => chunks.push(d));
      stream.on("end", () => {
        result = { filename: info.filename, buffer: Buffer.concat(chunks) };
      });
    });

    bb.on("finish", () => (result ? resolve(result) : reject(new Error("No file"))));
    bb.on("error", reject);
    req.pipe(bb);
  });
}
