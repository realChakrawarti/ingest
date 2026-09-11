 📋 Plan: Catalog & Archive Renaming

 ### 🌟 Goal

 Refactor the entire codebase to rename the Catalog concept to feed and the Archive concept to list across both the Backend (Data Layer) and Frontend
 (Presentation Layer).

 Why this matters:
 - The old terminology is outdated and requires a clean refactor to maintain consistency.
 - This will involve renaming types, imports, functions, API routes, and view logic.

 ### 🗺️ Audit Results

 I surveyed all relevant source files (excluding node_modules/) and identified the key locations for changes:

 ┌──────────────────────────┬──────────────────────────────────────────────────────────────────────────┐
 │ Area                     │ Files to Update                                                          │
 ├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ Catalog Backend Models   │ src/entities/catalogs/models/index.ts                                    │
 ├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ Catalog Backend Services │ src/entities/catalogs/services/*.ts                                      │
 ├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ Catalog Backend Index    │ src/entities/catalogs/index.ts                                           │
 ├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ Catalog API Routes       │ src/app/api/catalogs/route.ts, src/app/api/catalogs/[catalogId]/route.ts │
 ├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ Archive Backend Models   │ src/entities/archives/models/index.ts                                    │
 ├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ Archive Backend Services │ src/entities/archives/services/*.ts                                      │
 ├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ Archive Backend Index    │ src/entities/archives/index.ts                                           │
 ├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ Archive API Routes       │ src/app/api/archives/route.ts, src/app/api/archives/[archiveId]/route.ts │
 ├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ State Management         │ src/stores/catalog-store.ts                                              │
 ├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ Catalog Frontend Views   │ src/views/public-catalog/index.tsx, and dependencies                     │
 ├──────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
 │ Archive Frontend Views   │ src/views/public-archive/index.tsx, and dependencies                     │
 └──────────────────────────┴──────────────────────────────────────────────────────────────────────────┘

 ### 🔧 Phase-by-Phase Execution Plan

 #### Phase 1: Backend Data Models & Services

 🔵 src/entities/catalogs/models/index.ts

 1. Rename all Catalog-prefixed types to Feed-prefixed types:
     - CatalogMetaSchema → FeedMetaSchema
     - CatalogChannelSchema → FeedChannelSchema
     - CatalogPlaylistSchema → FeedPlaylistSchema
     - CatalogSubredditSchema → FeedSubredditSchema
     - CatalogPodcastItemSchema → FeedPodcastItemSchema
     - CatalogPodcastSchema → FeedPodcastSchema
     - CatalogListSchema → FeedListSchema
     - UserCatalogDocumentSchema → FeedUserCatalogDocumentSchema
     - CatalogByIDSchema → FeedByIDSchema
     - ContentByCatalogSchema → ContentByFeedSchema
     - ZCatalogChannel → ZFeedChannel
     - ZCatalogPodcast → ZFeedPodcast
     - ZCatalogSubreddit → ZFeedSubreddit
     - ZCatalogPlaylist → ZFeedPlaylist
     - ZCatalogList → ZFeedList
     - ZCatalogValid → ZFeedValid
 2. Rename internal references to these types.

 🔵 src/entities/catalogs/services/*.ts

 3. Rename all createCatalog, getCatalogById, getCatalogsByUser, etc. to:
     - createFeed, getFeedById, getFeedsByUser, etc.
 4. Rename file names to reflect the new terminology.

 🔵 src/entities/catalogs/index.ts

 5. Update re-exports to use the new function names.

 #### Phase 2: Backend API Routes

 🔵 src/app/api/catalogs/route.ts

 6. Update the error message: "Unable to retrieve user catalogs." → "Unable to retrieve user feeds."
 7. Update comments and return message in the POST handler.

 🔵 src/app/api/catalogs/[catalogId]/route.ts

 8. Update error message: AppErrorCodes.GET_CATALOG_BY_ID_FAILED → AppErrorCodes.GET_FEED_BY_ID_FAILED
 9. Update import path: getCatalogById → getFeedById

 🔵 src/app/api/archives/route.ts

 10. Update error message: AppErrorCodes.GET_USER_ARCHIVE_FAILED → AppErrorCodes.GET_USER_LIST_FAILED
 11. Update POST handler return message: "Archive created successfully." → "List created successfully."

 🔵 src/app/api/archives/[archiveId]/route.ts

 12. Update error message: AppErrorCodes.GET_ARCHIVE_BY_ID_FAILED → AppErrorCodes.GET_LIST_BY_ID_FAILED
 13. Update import path: getArchiveById → getListById

 #### Phase 3: State Management

 🟡 src/stores/catalog-store.ts

 14. Rename type imports from ZCatalog* to ZFeed*.
 15. Rename state field types in the State interface.
 16. Rename action function imports if any setSavedFeed* functions exist.

 #### Phase 4: Frontend Views

 🟡 src/views/public-catalog/index.tsx

 17. Rename the component function: PubliCatalog → FeedCatalog.
 18. Update route params from catalogId to feedId.
 19. Update API fetch path: /catalogs/${catalogId}/contents → /feeds/${feedId}/contents.
 20. Update import statements to reflect new types.

 🟡 src/views/public-archive/index.tsx

 21. Rename the component function (if applicable) and update routing from archiveId to listId.
 22. Update API fetch path: /archives/${archiveId} → /lists/${listId}.
 23. Update BackLink href: /explore/archives → /explore/lists.

 #### Phase 5: Frontend Edit Components

 🟡 src/views/edit-catalog/ and src/views/edit-archive/

 24. Review and update any text in these directories that refers to "catalog" or "archive".

 Phase 6: Documentation & Comments

 25. Add brief comments in the code explaining the renaming from "catalog with feed" to "feed".

 ### ✅ Post-Migration Verification

 After the rename is complete, run the following checks:

 1. grep -r "Catalog" src/ --include="*.ts" --include="*.tsx" → Should show only Catalyst or Zod type references, not Catalog functions.
 2. grep -r "archive with list" src/ --include="*.ts" --include="*.tsx" → Should show no matches.
 3. Verify API endpoints in src/app/api/* route files are correctly updated.

 ### 📊 Risk Assessment

 - Low risk: The renaming follows a consistent pattern (entity → new name).
 - Medium risk: API error codes may need separate registration in error code definitions.
 - Low risk: Zod schema renaming is isolated to the catalog model.
