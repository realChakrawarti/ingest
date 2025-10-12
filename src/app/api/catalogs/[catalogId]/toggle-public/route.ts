import { checkCatalogOwnership, updateCatalogPublicStatus } from "~/entities/catalogs";
import { createTogglePublicHandler } from "~/shared/lib/api/toggle-public-handler";

export const PATCH = createTogglePublicHandler(
  updateCatalogPublicStatus,
  checkCatalogOwnership,
  'catalog',
  'catalogId'
);
