// Reference: https://github.com/rainbow-me/rainbow/blob/develop/src/utils/time.ts

type TimeInMs = number;

type TimeUtils = {
  /** Convert days to milliseconds */
  days: (_days: number) => TimeInMs;
  /** Convert seconds to milliseconds */
  seconds: (_seconds: number) => TimeInMs;
  /** Convert minutes to milliseconds */
  minutes: (_minutes: number) => TimeInMs;
  /** Convert hours to milliseconds */
  hours: (_hours: number) => TimeInMs;
  /** Convert weeks to milliseconds */
  weeks: (_weeks: number) => TimeInMs;
  /** Represents infinite time */
  infinity: typeof Infinity;
  /** Represents zero time */
  zero: 0;
};

/**
 * Utility object for time conversions and helpers.
 * All methods convert the input unit to milliseconds.
 * @example
 * time.seconds(5) // 5 seconds
 * time.minutes(2) // 2 minutes
 * time.hours(1) // 1 hour
 * time.days(5) // 5 days
 * time.weeks(2) // 2 weeks
 * ––
 * time.infinity // Infinity
 * time.zero // 0
 */
export const time: TimeUtils = {
  days: (days) => time.hours(days * 24),
  hours: (hours) => time.minutes(hours * 60),
  infinity: Number.POSITIVE_INFINITY,
  minutes: (minutes) => time.seconds(minutes * 60),
  seconds: (seconds) => seconds * 1000,
  weeks: (weeks) => time.days(weeks * 7),
  zero: 0,
};
