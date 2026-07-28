import { describe, expect, it } from "vitest";

import formatLargeNumber from "./format-large-number";

describe("formatLargeNumber", () => {
  it("returns 0 for undefined values", () => {
    expect(formatLargeNumber(undefined)).toBe("0");
  });

  it("returns 0 for zero", () => {
    expect(formatLargeNumber(0)).toBe("0");
  });

  it("formats thousands", () => {
    expect(formatLargeNumber(1_500)).toBe("1.5K");
  });

  it("formats millions", () => {
    expect(formatLargeNumber(2_500_000)).toBe("2.5M");
  });

  it("formats billions", () => {
    expect(formatLargeNumber(3_200_000_000)).toBe("3.2B");
  });

  it("returns plain numbers below one thousand", () => {
    expect(formatLargeNumber(999)).toBe("999");
  });
});