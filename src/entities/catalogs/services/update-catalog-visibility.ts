import { Timestamp } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

const RATE_LIMIT_SECONDS = 120;

export async function updateCatalogVisibility(
	userId: string,
	catalogId: string,
	isPublic: boolean
) {
	const catalogRef = refs.catalogs.doc(catalogId);
	const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

	try {
		// Verify the catalog belongs to the user
		const userCatalogDoc = await userCatalogRef.get();

		if (!userCatalogDoc.exists) {
			return {
				success: false,
				message:
					"Catalog not found or you don't have permission to modify it.",
			};
		}

		const catalogDoc = await catalogRef.get();

		if (!catalogDoc.exists) {
			return {
				success: false,
				message: "Catalog not found.",
			};
		}

		const catalogData = catalogDoc.data();
		const now = Timestamp.now();

		// Check rate limit
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

		await catalogRef.update({
			isPublic: isPublic,
			isPublicUpdatedAt: now,
		});

		return {
			success: true,
			message: `Catalog is now ${isPublic ? "public" : "private"}.`,
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
			message: "Unable to update catalog visibility.",
		};
	}
}
