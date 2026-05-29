import { put } from "@vercel/blob";

function random(length = 6) {
return Math.random().toString(36).slice(2, 2 + length);
}

export async function POST(req) {
try {
const form = await req.formData();
const file = form.get("file");

if (!file) {
  return Response.json({
    status: false,
    message: "No file"
  });
}

const ext =
  file.name.split(".").pop() || "bin";

const id = random();

const blob = await put(
  `${id}.${ext}`,
  file,
  {
    access: "public"
  }
);

return Response.json({
  status: true,
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/file/${id}.${ext}`,
  blob: blob.url
});

} catch (e) {
return Response.json({
status: false,
message: e.message
});
}
}
