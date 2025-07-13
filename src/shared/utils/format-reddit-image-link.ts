export default function formatRedditImageLink(link: string | null | undefined) {
  if (!link) return "";
  return link.replace(/&amp;/g, "&");
}
