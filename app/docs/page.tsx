import Link from "next/link"
import styles from "./docs.module.css"

export const metadata = { title: "API Docs — FileDrop" }

export default function Docs() {
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.back}>← FileDrop</Link>
        <span className={styles.badge}>API v1</span>
      </nav>

      <h1 className={styles.title}>API Documentation</h1>
      <p className={styles.sub}>Simple file upload API. No auth required.</p>

      <section className={styles.section}>
        <h2 className={styles.h2}>POST /api/upload</h2>
        <p className={styles.p}>Upload any file using <code>multipart/form-data</code>.</p>

        <div className={styles.table}>
          <div className={styles.row}>
            <span className={styles.key}>Method</span>
            <code className={styles.val}>POST</code>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>Endpoint</span>
            <code className={styles.val}>/api/upload</code>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>Content-Type</span>
            <code className={styles.val}>multipart/form-data</code>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>Field</span>
            <code className={styles.val}>file</code>
          </div>
          <div className={styles.row}>
            <span className={styles.key}>Auth</span>
            <code className={styles.val}>None</code>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Response</h2>
        <pre className={styles.code}>{`{
  "status": true,
  "url": "https://domain.vercel.app/file/abc123.jpg"
}`}</pre>
        <pre className={styles.code}>{`// Error
{
  "status": false,
  "error": "No file provided"
}`}</pre>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Examples</h2>

        <h3 className={styles.h3}>cURL</h3>
        <pre className={styles.code}>{`curl -X POST https://domain.vercel.app/api/upload \\
  -F "file=@/path/to/file.jpg"`}</pre>

        <h3 className={styles.h3}>Node.js (axios)</h3>
        <pre className={styles.code}>{`const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function upload(filePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  const { data } = await axios.post(
    "https://domain.vercel.app/api/upload",
    form,
    { headers: form.getHeaders() }
  );

  return data.url;
}

// Upload from buffer
async function uploadBuffer(buffer, filename) {
  const form = new FormData();
  form.append("file", buffer, filename);

  const { data } = await axios.post(
    "https://domain.vercel.app/api/upload",
    form,
    { headers: form.getHeaders() }
  );

  return data.url;
}`}</pre>

        <h3 className={styles.h3}>Python (requests)</h3>
        <pre className={styles.code}>{`import requests

def upload(file_path):
    with open(file_path, "rb") as f:
        res = requests.post(
            "https://domain.vercel.app/api/upload",
            files={"file": f}
        )
    return res.json()["url"]`}</pre>

        <h3 className={styles.h3}>Browser (fetch)</h3>
        <pre className={styles.code}>{`async function upload(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  return data.url;
}`}</pre>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>File URL Format</h2>
        <p className={styles.p}>
          After upload, files are accessible via a short URL:
        </p>
        <pre className={styles.code}>{`https://domain.vercel.app/file/{id}.{ext}

# Examples:
https://domain.vercel.app/file/abc123.jpg
https://domain.vercel.app/file/x7k2m9.mp4
https://domain.vercel.app/file/q9w3e1.pdf`}</pre>
      </section>
    </main>
  )
}
