import { checkArchiveOwnership, updateArchivePublicStatus } from "~/entities/archives";
import { createTogglePublicHandler } from "~/shared/lib/api/toggle-public-handler";

export const PATCH = createTogglePublicHandler(
  updateArchivePublicStatus,
  checkArchiveOwnership,
  'archive',
  'archiveId'
);
