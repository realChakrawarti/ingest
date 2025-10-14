import type { Timestamp } from "firebase-admin/firestore";
import { refs } from "~/shared/lib/firebase/refs";
import { 
  updateWithPublicStatus,
  type UpdateWithPublicStatusResult,
  type UpdateWithPublicStatusOptions
} from "~/shared/lib/firebase/update-with-public-status";

import type { ZArchiveMeta } from "../models";

interface ArchiveUpdatePayload extends Partial<ZArchiveMeta> {
  isPublic?: boolean;
}

export interface ArchiveUpdateResult {
  success: boolean;
  message: string;
  statusCode?: number;
}

export interface ArchiveUpdateOptions {
  isPublicUpdatedAt?: Timestamp;
}

export async function updateArchiveMeta(
  archiveId: string,
  archiveMeta: ArchiveUpdatePayload,
  options: ArchiveUpdateOptions = {}
): Promise<ArchiveUpdateResult> {
  const archiveRef = refs.archives.doc(archiveId);
  const { isPublicUpdatedAt } = options;

  const updateOptions: UpdateWithPublicStatusOptions = {
    isPublicUpdatedAt,
    entityName: 'Archive'
  };

  const result: UpdateWithPublicStatusResult = await updateWithPublicStatus(
    archiveRef,
    archiveMeta,
    null, // Passing null for currentData as it's unused but still required in the signature
    updateOptions
  );

  return result;
}
