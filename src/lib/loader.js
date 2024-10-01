export default function shopifyImageLoader({ src, width }) {
  const url = new URL(src);

  url.searchParams.set("width", width);

  return url.href;
}
