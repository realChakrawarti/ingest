export default function formatSecondsToHMS(totalSeconds: number) {
  if (typeof totalSeconds !== "number" || totalSeconds < 0) {
    return "Invalid Input";
  }

  const hours = Math.floor(Math.trunc(totalSeconds) / 3600);
  const minutes = Math.floor((Math.trunc(totalSeconds) % 3600) / 60);
  const seconds = Math.trunc(totalSeconds) % 60;

  // Pad single-digit numbers with a leading zero
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  if (hours === 0) {
    // If hours are 0, return mm:ss
    return `${paddedMinutes}:${paddedSeconds}`;
  }
  // Otherwise, return HH:mm:ss
  const paddedHours = String(hours).padStart(2, "0");
  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}