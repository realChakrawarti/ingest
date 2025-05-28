/* eslint-disable sort-keys */
const ONE_HOUR = 3_600_000;
const ONE_DAY = ONE_HOUR * 24;
export const TimeMs = {
  /**
   * Milliseconds in 1 hour
   */
  "1h": ONE_HOUR,
  /**
   * Milliseconds in 4 hours
   */
  "4h": 4 * ONE_HOUR,
  /**
   * Milliseconds in 12 hours
   */
  "12h": 12 * ONE_HOUR,
  /**
   * Milliseconds in 1 day
   */
  "1d": ONE_DAY,
  /**
   * Milliseconds in 1 week
   */
  "1w": 7 * ONE_DAY,
  /**
   * Milliseconds in 1 month
   */
  "1m": 30 * ONE_DAY,
};

export const SESSION_COOKIE_NAME = "__session";

export const Routes = {
  ROOT: "/",
  DASHBOARD: "/dashboard",
} as const;

export const Regex = {
  // eslint-disable-next-line @stylistic/max-len
  YOUTUBE_VIDEO_LINK:
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/,
};
