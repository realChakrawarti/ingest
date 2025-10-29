import { Timestamp } from "firebase-admin/firestore";

import { admin } from "~/shared/lib/firebase/admin";
import { RATE_LIMIT_SECONDS } from "~/shared/lib/constants";
import { refs } from "~/shared/lib/firebase/refs";

export async function updateCatalogVisibility(
	userId: string,
	catalogId: string,
	isPublic: boolean
) {
	const catalogRef = refs.catalogs.doc(catalogId);
	const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

	try {
		// Run rate limit check and update in a transaction to prevent race conditions
		const result = await admin.db.runTransaction(async (txn) => {
			// Verify the catalog belongs to the user
			const userCatalogDoc = await txn.get(userCatalogRef);

			if (!userCatalogDoc.exists) {
				return {
					success: false,
					message:
						"Catalog not found or you don't have permission to modify it.",
				};
			}

			// Read catalog data within transaction
			const catalogDoc = await txn.get(catalogRef);

			if (!catalogDoc.exists) {
				return {
					success: false,
					message: "Catalog not found.",
				};
			}

			const catalogData = catalogDoc.data();
			const now = Timestamp.now();

			// Check rate limit with transaction-read data
			if (catalogData?.isPublicUpdatedAt) {
				const lastUpdate = catalogData.isPublicUpdatedAt as Timestamp;
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
			txn.update(catalogRef, {
				isPublic: isPublic,
				isPublicUpdatedAt: now,
			});

			return {
				success: true,
				message: `Catalog is now ${isPublic ? "public" : "private"}.`,
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
			message: "Unable to update catalog visibility.",
		};
	}
}
