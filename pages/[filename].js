import { list } from "@vercel/blob";

export async function getServerSideProps({ params, res }) {
  const filename = decodeURIComponent(params.filename);

  const { blobs } = await list();

  const file = blobs.find((b) => {
    const pathname = decodeURIComponent(
      new URL(b.url).pathname.split("/").pop()
    );

    return pathname === filename;
  });

  if (!file) {
    return {
      notFound: true,
    };
  }

  const response = await fetch(file.url);

  const contentType =
    response.headers.get("content-type") || "application/octet-stream";

  const buffer = Buffer.from(await response.arrayBuffer());

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "public, max-age=31536000");

  res.write(buffer);
  res.end();

  return {
    props: {},
  };
}

export default function FilePage() {
  return null;
}
