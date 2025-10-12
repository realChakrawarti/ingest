import { refs } from "~/shared/lib/firebase/refs";

/**
 * Checks if a user owns a specific archive
 * @param userId - The user ID to check ownership for
 * @param archiveId - The archive ID to check
 * @returns Promise<boolean> - True if user owns the archive, false otherwise
 */
export async function checkArchiveOwnership(
  userId: string,
  archiveId: string
): Promise<boolean> {
  try {
    const userArchiveRef = refs.userArchives(userId).doc(archiveId);
    const userArchiveSnap = await userArchiveRef.get();
    return userArchiveSnap.exists;
  } catch (_err) {
    // Return false on any error (e.g., permission denied, network issues)
    return false;
  }
}