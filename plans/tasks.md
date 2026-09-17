# 🔨 Execution Checklist: Catalog & Archive Renaming

*These tasks track the refactoring of 'Catalog' to 'Feed' and 'Archive' to 'List'.*

## Phase 1: Backend Data Models & Services
**Goal:** Rename Catalog-prefixed types and functions to Feed-prefixed types.

[ ] 🔵 src/entities/catalogs/services/*.ts: Rename all createCatalog, getCatalogById, getCatalogsByUser, etc., to createFeed, getFeedById, getFeedsByUser, etc.
[ ] 🔵 src/entities/catalogs/services/*.ts: Rename file names to reflect new terminology.
[ ] 🔵 src/entities/catalogs/index.ts: Update re-exports to use the new function names.

---

## Phase 2: Backend API Routes
**Goal:** Update API routes to use new terminology and error codes.

[ ] 🔵 src/app/api/catalogs/route.ts: Update the error message: "Unable to retrieve user catalogs." → "Unable to retrieve user feeds."
[ ] 🔵 src/app/api/catalogs/[catalogId]/route.ts: Update error message: AppErrorCodes.GET_CATALOG_BY_ID_FAILED → AppErrorCodes.GET_FEED_BY_ID_FAILED.
[ ] 🔵 src/app/api/catalogs/[catalogId]/route.ts: Update import path: getCatalogById → getFeedById.
[ ] 🔵 src/app/api/archives/route.ts: Update error message: AppErrorCodes.GET_USER_ARCHIVE_FAILED → AppErrorCodes.GET_USER_LIST_FAILED.
[ ] 🔵 src/app/api/archives/route.ts: Update POST handler return message: "Archive created successfully." → "List created successfully."
[ ] 🔵 src/app/api/archives/[archiveId]/route.ts: Update error message: AppErrorCodes.GET_ARCHIVE_BY_ID_FAILED → AppErrorCodes.GET_LIST_BY_ID_FAILED.
[ ] 🔵 src/app/api/archives/[archiveId]/route.ts: Update import path: getArchiveById → getListById.

---

## Phase 3: State Management
**Goal:** Align state management with new terminology.

[ ] 🟡 src/stores/catalog-store.ts: Rename type imports from ZCatalog* to ZFeed*.
[ ] 🟡 src/stores/catalog-store.ts: Rename state field types in the State interface.
[ ] 🟡 src/stores/catalog-store.ts: Rename action function imports if any setSavedFeed* functions exist.

---

## Phase 4: Frontend Views
**Goal:** Rename components and update frontend routing/API calls.

[ ] 🟡 src/views/public-catalog/index.tsx: Rename the component function: PubliCatalog → FeedCatalog.
[ ] 🟡 src/views/public-catalog/index.tsx: Update route params from catalogId to feedId.
[ ] 🟡 src/views/public-catalog/index.tsx: Update API fetch path: /catalogs/${catalogId}/contents → /feeds/${feedId}/contents.
[ ] 🟡 src/views/public-catalog/index.tsx: Update import statements to reflect new types.
[ ] 🟡 src/views/public-archive/index.tsx: Rename the component function (if applicable) and update routing from archiveId to listId.
[ ] 🟡 src/views/public-archive/index.tsx: Update API fetch path: /archives/${archiveId} → /lists/${listId}.
[ ] 🟡 src/views/public-archive/index.tsx: Update BackLink href: /explore/archives → /explore/lists.

---

## Phase 5: Frontend Edit Components
**Goal:** General cleanup in edit views.

[ ] 🟡 src/views/edit-catalog/ and src/views/edit-archive/: Review and update any text in these directories that refers to "catalog" or "archive".

---

## Phase 6: Documentation & Comments
**Goal:** Add necessary contextual documentation.

[ ] 🟢 Add brief comments in the code explaining the renaming from "catalog with feed" to "feed".

---

## ✅ Post-Migration Verification (Final Steps)
[ ] 1. `grep -r "Catalog" src/ --include="*.ts" --include="*.tsx"`: Ensure only Catalyst or Zod type references remain (no Catalog functions).
[ ] 2. `grep -r "archive with list" src/ --include="*.ts" --include="*.tsx"`: Ensure no matches.
[ ] 3. Verify API endpoints in src/app/api/* route files are correctly updated.
