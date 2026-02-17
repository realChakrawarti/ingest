/**
 * @example
 * const endTimer = createTimer();
 * heavyFunction();
 * endTimer(); // "12.34 ms"
 */

export function createTimer(): () => string {
  const start = process.hrtime.bigint();

  return () => {
    const end = process.hrtime.bigint();
    const diffMs = Number(end - start) / 1_000_000;
    return `${diffMs.toFixed(2)} ms`;
  };
}
