function formatPluralUnit(value: number, type: "month" | "minute" | "hour" | "day") {
  return `${value} ${type}${value > 1 ? "s" : ""}`;
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
    minutes = timeDiff;
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

function getDifferenceString(
  deltaMinutes: number,
  suffix: "ago" | "later",
  suffixEnabled: boolean = false
) {
  const { months, days, hours, minutes } =
    formatTimeDifferenceWithMonths(deltaMinutes);
  let timeDifferenceString = "";

  if (months) {
    timeDifferenceString = `${formatPluralUnit(months, "month")} `;
    if (suffixEnabled) {
      return timeDifferenceString + suffix;
    }
  }

  if (days) {
    timeDifferenceString += `${formatPluralUnit(days, "day")} `;
    if (suffixEnabled) {
      return timeDifferenceString + suffix;
    }
  }
  if (hours) {
    timeDifferenceString += `${formatPluralUnit(hours, "hour")} `;
    if (suffixEnabled) {
      return timeDifferenceString + suffix;
    }
  }
  if (minutes) {
    timeDifferenceString += `${formatPluralUnit(minutes, "minute")} `;
    if (suffixEnabled) {
      return timeDifferenceString + suffix;
    }
  }
  return timeDifferenceString + suffix;
}

/**
 *
 * @param {string} compareWithCurrent - Compare with current time
 * @param {boolean} [suffixEnabled=false] - Approximate time difference with `ago` and `later` appended
 * @param {boolean} [limitMonth=true] - Show N/A when time difference exceeds 30 days
 * @returns {(string | number)[]}
 */
export function getTimeDifference(
  compareWithCurrent: string,
  suffixEnabled: boolean = false,
  limitMonth: boolean = true
): [number, string] {
  const currentTime = Date.now();
  const serverTime = new Date(compareWithCurrent).getTime();

  const delta = currentTime - serverTime;
  const deltaMinutes = Math.abs(delta) / (60 * 1000); // In minutes

  if (deltaMinutes > MINUTES_PER_MONTH && limitMonth) {
    return [0, "N/A"];
  }

  if (deltaMinutes < 1) {
    return [0, "Just now"];
  }

  const suffix = delta > 0 ? "ago" : "later";
  const direction = delta > 0 ? -1 : 1;
  const diffToString = getDifferenceString(deltaMinutes, suffix, suffixEnabled);

  return [direction, diffToString];
}
