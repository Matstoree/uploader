import Head from "next/head";
import Link from "next/link";

const nodeExample = `const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function upload(filePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  const { data } = await axios.post(
    "https://your-domain.vercel.app/api/upload",
    form,
    { headers: form.getHeaders() }
  );

  return data.url;
}

// Penggunaan
upload("./photo.jpg").then(url => console.log("URL:", url));`;

const curlExample = `curl -X POST https://your-domain.vercel.app/api/upload \\
  -F "file=@/path/to/file.jpg"`;

const responseExample = `{
  "status": true,
  "url": "https://your-domain.vercel.app/..."
}`;

const errorExample = `{
  "status": false,
  "error": "No file provided"
}`;

const fetchExample = `const form = new FormData();
form.append("file", fileInput.files[0]);

const res = await fetch("/api/upload", {
  method: "POST",
  body: form
});

const { status, url } = await res.json();
console.log(url);`;

export default function Docs() {
  return (
    <>
      <Head><title>API Docs — FileUp</title></Head>
      <nav>
        <div className="logo">File<span>Up</span></div>
        <Link href="/">← home</Link>
      </nav>

      <div className="page docs">
        <h1><em>API</em> Docs</h1>
        <p className="sub">// REST API untuk upload file secara programatik</p>

        <section>
          <h2>Endpoint</h2>
          <p><span className="tag post">POST</span><span className="endpoint">/api/upload</span></p>
          <p>Upload file menggunakan <code>multipart/form-data</code>. Tidak perlu autentikasi atau API key.</p>
        </section>

        <section>
          <h2>Request</h2>
          <table>
            <thead><tr><th>Field</th><th>Type</th><th>Deskripsi</th></tr></thead>
            <tbody>
              <tr><td>file</td><td>File (form-data)</td><td>File yang akan diupload</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>Response</h2>
          <p>Sukses:</p>
          <pre>{responseExample}</pre>
          <p>Error:</p>
          <pre>{errorExample}</pre>
        </section>

        <section>
          <h2>Contoh — cURL</h2>
          <pre>{curlExample}</pre>
        </section>

        <section>
          <h2>Contoh — Node.js</h2>
          <pre>{nodeExample}</pre>
        </section>

        <section>
          <h2>Contoh — Browser (Fetch)</h2>
          <pre>{fetchExample}</pre>
        </section>

        <section>
          <h2>Catatan</h2>
          <table>
            <thead><tr><th>Item</th><th>Detail</th></tr></thead>
            <tbody>
              <tr><td>Ukuran max</td><td>500MB per file</td></tr>
              <tr><td>Jenis file</td><td>Semua jenis didukung</td></tr>
              <tr><td>Expiry</td><td>Tidak ada (permanent)</td></tr>
              <tr><td>Auth</td><td>Tidak diperlukan</td></tr>
              <tr><td>Storage</td><td>Vercel Blob</td></tr>
            </tbody>
          </table>
        </section>
      </div>

      <footer>FileUp · API Docs</footer>
    </>
  );
}
