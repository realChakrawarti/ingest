import { Timestamp } from "firebase-admin/firestore";

import { RATE_LIMIT_SECONDS } from "~/shared/lib/constants";
import { admin } from "~/shared/lib/firebase/admin";
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
          message:
            "Catalog not found or you don't have permission to modify it.",
          success: false,
        };
      }

      // Read catalog data within transaction
      const catalogDoc = await txn.get(catalogRef);

      if (!catalogDoc.exists) {
        return {
          message: "Catalog not found.",
          success: false,
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
            message: `Please wait ${remainingTime} seconds before updating visibility again.`,
            remainingTime,
            success: false,
          };
        }
      }

      // Atomically update the document
      txn.update(catalogRef, {
        isPublic: isPublic,
        isPublicUpdatedAt: now,
      });

      return {
        message: `Catalog is now ${isPublic ? "public" : "private"}.`,
        success: true,
      };
    });

    return result;
  } catch (err) {
    if (err instanceof Error) {
      return {
        message: err.message,
        success: false,
      };
    }
    return {
      message: "Unable to update catalog visibility.",
      success: false,
    };
  }
}
