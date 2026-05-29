"use client";

import { useState } from "react";

export default function Home() {
const [url, setUrl] = useState("");
const [loading, setLoading] = useState(false);

async function upload(e) {
const file = e.target.files[0];
if (!file) return;

setLoading(true);

const form = new FormData();
form.append("file", file);

const res = await fetch("/api/upload", {
  method: "POST",
  body: form
});

const data = await res.json();

setLoading(false);

if (data.status) setUrl(data.url);

}

return (
<main
style={{
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
padding: 20
}}
>
<div
style={{
width: "100%",
maxWidth: 500,
textAlign: "center"
}}
>
<h1>Matstoree Upload</h1>

    <input
      type="file"
      onChange={upload}
      style={{ width: "100%" }}
    />

    {loading && <p>Uploading...</p>}

    {url && (
      <>
        <p>Upload berhasil</p>
        <input
          value={url}
          readOnly
          style={{
            width: "100%",
            padding: 10
          }}
        />
      </>
    )}
  </div>
</main>

);
}
