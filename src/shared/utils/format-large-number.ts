export default function formatLargeNumber(num: number): string {
  const billion = 1_000_000_000;
  const million = 1_000_000;
  const thousand = 1_000;

  if (num >= billion) {
    return `${(num / billion).toFixed(1)}B`;
  }
  if (num >= million) {
    return `${(num / million).toFixed(1)}M`;
  }
  if (num >= thousand) {
    return `${(num / thousand).toFixed(1)}K`;
  }
  return num?.toString();
}
