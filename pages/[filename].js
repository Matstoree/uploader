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

  res.writeHead(302, {
    Location: file.url,
  });

  res.end();

  return {
    props: {},
  };
}

export default function FilePage() {
  return null;
}
