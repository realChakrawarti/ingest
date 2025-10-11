import { Timestamp } from "firebase-admin/firestore";

const RATE_LIMIT_DURATION_MS = 120 * 1000; // 120 seconds in milliseconds

export interface RateLimitResult {
  allowed: boolean;
  remainingTime?: number;
  message: string;
}

/**
 * Checks if the isPublic field can be updated based on rate limiting rules.
 * Users can only change the isPublic status once every 120 seconds.
 * 
 * @param lastUpdated - The timestamp of the last isPublic field update
 * @returns RateLimitResult indicating if the update is allowed
 */
export function checkIsPublicRateLimit(lastUpdated?: Timestamp): RateLimitResult {
  if (!lastUpdated) {
    // First time updating, allow it
    return {
      allowed: true,
      message: "Update allowed - first time setting isPublic status.",
    };
  }

  const now = Date.now();
  const lastUpdatedMs = lastUpdated.toMillis();
  const timeSinceLastUpdate = now - lastUpdatedMs;

  if (timeSinceLastUpdate >= RATE_LIMIT_DURATION_MS) {
    return {
      allowed: true,
      message: "Update allowed - rate limit period has passed.",
    };
  }

  const remainingTime = RATE_LIMIT_DURATION_MS - timeSinceLastUpdate;
  const remainingSeconds = Math.ceil(remainingTime / 1000);

  return {
    allowed: false,
    remainingTime: remainingSeconds,
    message: `Rate limit exceeded. You can change the public/private status again in ${remainingSeconds} seconds.`,
  };
}

/**
 * Gets the current timestamp for storing when isPublic was last updated
 */
export function getCurrentTimestamp(): Timestamp {
  return Timestamp.now();
}