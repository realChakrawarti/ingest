import type { Timestamp } from "firebase-admin/firestore";
import { refs } from "~/shared/lib/firebase/refs";
import { 
  updateWithPublicStatus,
  type UpdateWithPublicStatusResult,
  type UpdateWithPublicStatusOptions
} from "~/shared/lib/firebase/update-with-public-status";

import type { ZCatalogMeta } from "../models";

interface CatalogUpdatePayload extends ZCatalogMeta {
  isPublic?: boolean;
}

export interface CatalogUpdateResult {
  success: boolean;
  message: string;
  statusCode?: number;
}

export interface CatalogUpdateOptions {
  isPublicUpdatedAt?: Timestamp;
  currentData?: any;
}

export async function updateCatalogMeta(
  catalogId: string,
  payload: CatalogUpdatePayload,
  options: CatalogUpdateOptions = {}
): Promise<CatalogUpdateResult> {
  const catalogRef = refs.catalogs.doc(catalogId);
  const { isPublicUpdatedAt, currentData } = options;

  const updateOptions: UpdateWithPublicStatusOptions = {
    isPublicUpdatedAt,
    entityName: 'Catalog'
  };

  const result: UpdateWithPublicStatusResult = await updateWithPublicStatus(
    catalogRef,
    payload,
    currentData,
    updateOptions
  );

  return result;
}
