import { Timestamp } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

const RATE_LIMIT_SECONDS = 120;

export async function updateArchiveVisibility(
	archiveId: string,
	isPublic: boolean
) {
	const archiveRef = refs.archives.doc(archiveId);

	try {
		const archiveDoc = await archiveRef.get();

		if (!archiveDoc.exists) {
			return {
				success: false,
				message: "Archive not found.",
			};
		}

		const archiveData = archiveDoc.data();
		const now = Timestamp.now();

		// Check rate limit
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

		await archiveRef.update({
			isPublic: isPublic,
			isPublicUpdatedAt: now,
		});

		return {
			success: true,
			message: `Archive is now ${isPublic ? "public" : "private"}.`,
		};
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
