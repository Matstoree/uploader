import { useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

const icons = { image: "🖼️", video: "🎬", audio: "🎵", pdf: "📄", zip: "🗜️", default: "📦" };
const getIcon = (type) => {
  if (type.startsWith("image")) return icons.image;
  if (type.startsWith("video")) return icons.video;
  if (type.startsWith("audio")) return icons.audio;
  if (type.includes("pdf")) return icons.pdf;
  if (type.includes("zip") || type.includes("rar")) return icons.zip;
  return icons.default;
};

export default function Home() {
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const inputRef = useRef();

  const upload = async (file) => {
    setUploading(true); setError(""); setUrl(""); setProgress(0);
    const form = new FormData();
    form.append("file", file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
      };
      const res = await new Promise((resolve, reject) => {
        xhr.onload = () => resolve(JSON.parse(xhr.responseText));
        xhr.onerror = reject;
        xhr.open("POST", "/api/upload");
        xhr.send(form);
      });
      if (res.status) {
        setUrl(res.url);
        setHistory((h) => [{ name: file.name, url: res.url, type: file.type }, ...h.slice(0, 9)]);
      } else {
        setError(res.error || "Upload gagal");
      }
    } catch {
      setError("Upload gagal. Coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const copy = (text) => { navigator.clipboard.writeText(text); };

  return (
    <>
      <Head><title>FileUp — Simple File Uploader</title></Head>
      <nav>
        <div className="logo">File<span>Up</span></div>
        <Link href="/docs">docs →</Link>
      </nav>

      <div className="page">
        <h1>Upload <em>anything.</em><br />Share instantly.</h1>
        <p className="sub">// no login · no expiry · permanent storage</p>

        <div
          className={`drop-zone${drag ? " drag" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) upload(f); }}
        >
          <input ref={inputRef} type="file" onChange={(e) => { const f = e.target.files[0]; if (f) upload(f); }} />
          <div className="drop-icon">{uploading ? "⏳" : "⬆️"}</div>
          <div className="drop-label">
            {uploading ? `Uploading… ${progress}%` : <><strong>Klik atau drop file</strong> di sini</>}
          </div>
          <div className="drop-hint">Semua jenis file didukung · Ukuran max 500MB</div>
        </div>

        <div className={`progress-wrap${uploading ? " show" : ""}`}>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <div className="progress-text">{progress}% uploaded</div>
        </div>

        <div className={`result${url ? " show" : ""}`}>
          <div className="result-label">✓ File berhasil diupload</div>
          <div className="result-row">
            <div className="result-url">{url}</div>
            <button className="copy-btn" onClick={() => copy(url)}>COPY</button>
          </div>
        </div>

        <div className={`error${error ? " show" : ""}`}>⚠ {error}</div>

        {history.length > 0 && (
          <div className="history">
            <h2>// Recent uploads</h2>
            {history.map((f, i) => (
              <div className="history-item" key={i}>
                <span className="file-icon">{getIcon(f.type)}</span>
                <div className="file-info">
                  <div className="file-name">{f.name}</div>
                  <div className="file-url">{f.url}</div>
                </div>
                <button className="copy-small" onClick={() => copy(f.url)}>COPY</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer>FileUp · Powered by Vercel Blob · No expiry</footer>
    </>
  );
}
