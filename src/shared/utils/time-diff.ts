function formatPluralUnit(value: number, type: "mo" | "min" | "hr" | "d") {
  if (type === "d") {
    return `${value}${type}`;
  }
  return `${value}${type}${value > 1 ? "s" : ""}`;
}

const MINUTES_PER_HOUR = 60;

const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
const MINUTES_PER_MONTH = MINUTES_PER_DAY * 30;

function formatTimeDifferenceWithMonths(timeDiff: number) {
  let months = 0;
  let days = 0;
  let hours = 0;
  let minutes = 0;

  if (timeDiff < MINUTES_PER_HOUR) {
    minutes = Math.floor(timeDiff);
  } else if (timeDiff < MINUTES_PER_DAY) {
    hours = Math.floor(timeDiff / MINUTES_PER_HOUR);
    minutes = Math.round(timeDiff % MINUTES_PER_HOUR);
  } else if (timeDiff < MINUTES_PER_MONTH) {
    days = Math.floor(timeDiff / MINUTES_PER_DAY);
    const remainingMinutes = timeDiff % MINUTES_PER_DAY;
    hours = Math.floor(remainingMinutes / MINUTES_PER_HOUR);
    minutes = Math.round(remainingMinutes % MINUTES_PER_HOUR);
  } else {
    months = Math.floor(timeDiff / MINUTES_PER_MONTH);
    const remainingMinutesAfterMonths = timeDiff % MINUTES_PER_MONTH;

    days = Math.floor(remainingMinutesAfterMonths / MINUTES_PER_DAY);
    const remainingMinutesAfterDays =
      remainingMinutesAfterMonths % MINUTES_PER_DAY;

    hours = Math.floor(remainingMinutesAfterDays / MINUTES_PER_HOUR);
    minutes = Math.round(remainingMinutesAfterDays % MINUTES_PER_HOUR);
  }

  // Return as an object for clarity when dealing with more units
  return { days, hours, minutes, months };
}

export function getDifferenceString(deltaMinutes: number, nearest = true) {
  const { months, days, hours, minutes } =
    formatTimeDifferenceWithMonths(deltaMinutes);
  let timeDifferenceString = "";

  if (months) {
    timeDifferenceString = `${formatPluralUnit(months, "mo")} `;
    if (nearest) {
      return timeDifferenceString;
    }
  }

  if (days) {
    timeDifferenceString += `${formatPluralUnit(days, "d")} `;
    if (nearest) {
      return timeDifferenceString;
    }
  }
  if (hours) {
    timeDifferenceString += `${formatPluralUnit(hours, "hr")} `;
    if (nearest) {
      return timeDifferenceString;
    }
  }
  if (minutes) {
    timeDifferenceString += `${formatPluralUnit(minutes, "min")} `;
    if (nearest) {
      return timeDifferenceString;
    }
  }
  return timeDifferenceString;
}

/**
 * @returns {number} - Returns the time difference in milliseconds
 */
export function timeDelta(compareWithCurrent: string | number): number {
  const currentTime = Date.now();
  const serverTime = new Date(compareWithCurrent).getTime();

  const delta = currentTime - serverTime;

  return delta;
}

export function getTimeDifference(props: {
  value: string | number;
  suffixEnabled: boolean;
  limitMonth: boolean;
  nearest: boolean;
}): [number, string] {
  const delta = timeDelta(props.value);
  const deltaMinutes = Math.abs(delta) / (60 * 1000); // In minutes

  if (deltaMinutes > MINUTES_PER_MONTH && props.limitMonth) {
    return [0, "N/A"];
  }

  if (deltaMinutes < 1) {
    return [0, "Just now"];
  }

  const suffix = delta > 0 ? "ago" : "later";
  const direction = delta > 0 ? -1 : 1;
  let diffToString = getDifferenceString(deltaMinutes, props.nearest);
  if (props.suffixEnabled) {
    diffToString += ` ${suffix}`;
  }

  return [direction, diffToString];
}