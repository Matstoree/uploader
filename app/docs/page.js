export default function Docs() {
  return (
    <main style={{ padding: 30 }}>
      <h1>Matstoree API Docs</h1>

      <pre>{`POST /api/upload

Form Data:
file

Response:

{
  "status": true,
  "url": "https://domain.vercel.app/file/abc123.jpg"
}`}</pre>

      <h2>Node.js Example</h2>

      <pre>{`const axios = require("axios");
const FormData = require("form-data");

async function upload(buffer, filename) {
  const form = new FormData();

  form.append("file", buffer, filename);

  const { data } = await axios.post(
    "https://domain.vercel.app/api/upload",
    form,
    {
      headers: form.getHeaders()
    }
  );

  return data.url;
}`}</pre>
    </main>
  );
}
