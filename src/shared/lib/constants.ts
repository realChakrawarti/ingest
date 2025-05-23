/* eslint-disable sort-keys */
const ONE_HOUR = 3_600_000;
const ONE_DAY = ONE_HOUR * 24;
export const timeMs = {
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
