import { list } from "@vercel/blob";

export async function GET(req, { params }) {
  const { blobs } = await list();

  const file = blobs.find(
    v => v.pathname === params.id
  );

  if (!file) {
    return new Response("Not Found", {
      status: 404
    });
  }

  return Response.redirect(file.url);
}
