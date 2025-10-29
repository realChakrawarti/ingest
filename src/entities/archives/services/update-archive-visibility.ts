import { Timestamp } from "firebase-admin/firestore";

import { admin } from "~/shared/lib/firebase/admin";
import { RATE_LIMIT_SECONDS } from "~/shared/lib/constants";
import { refs } from "~/shared/lib/firebase/refs";

export async function updateArchiveVisibility(
	userId: string,
	archiveId: string,
	isPublic: boolean
) {
	const archiveRef = refs.archives.doc(archiveId);
	const userArchiveRef = refs.userArchives(userId).doc(archiveId);

	try {
		// Run rate limit check and update in a transaction to prevent race conditions
		const result = await admin.db.runTransaction(async (txn) => {
			// Verify the archive belongs to the user
			const userArchiveDoc = await txn.get(userArchiveRef);

			if (!userArchiveDoc.exists) {
				return {
					success: false,
					message:
						"Archive not found or you don't have permission to modify it.",
				};
			}

			// Read archive data within transaction
			const archiveDoc = await txn.get(archiveRef);

			if (!archiveDoc.exists) {
				return {
					success: false,
					message: "Archive not found.",
				};
			}

			const archiveData = archiveDoc.data();
			const now = Timestamp.now();

			// Check rate limit with transaction-read data
			if (archiveData?.isPublicUpdatedAt) {
				const lastUpdate = archiveData.isPublicUpdatedAt as Timestamp;
				const timeDiffSeconds = now.seconds - lastUpdate.seconds;

				if (timeDiffSeconds < RATE_LIMIT_SECONDS) {
					const remainingTime = RATE_LIMIT_SECONDS - timeDiffSeconds;
					return {
						success: false,
						message: `Please wait ${remainingTime} seconds before updating visibility again.`,
						remainingTime,
					};
				}
			}

			// Atomically update the document
			txn.update(archiveRef, {
				isPublic: isPublic,
				isPublicUpdatedAt: now,
			});

			return {
				success: true,
				message: `Archive is now ${isPublic ? "public" : "private"}.`,
			};
		});

		return result;
	} catch (err) {
		if (err instanceof Error) {
			return {
				success: false,
				message: err.message,
			};
		}
		return {
			success: false,
			message: "Unable to update archive visibility.",
		};
	}
}
