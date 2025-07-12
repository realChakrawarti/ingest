export default function formatRedditImageLink(link: string) {
  if (!link) return "";
  return link.replace(/&amp;/g, "&");
}
