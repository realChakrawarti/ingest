# Plan: Feature Renaming and Refactoring

**Goal:** To systematically rename concepts within the codebase:
1.  Rename "catalog with feed" to "feed".
2.  Rename "archive with list" to "list" (or update the logic related to archiving/listing).

The changes must be applied across both the frontend and backend layers.

## 🎯 Scope Identification

The codebase primarily consists of:
*   **Backend/API (Data Layer):** Modules responsible for data models and endpoints (`src/entities/*`, `src/app/api/*`).
*   **Frontend (Presentation Layer):** React components, views, and state management (`src/views/*`, `src/stores/*`, `src/components/*`).

## 🗺️ File Structure Map for Traversal

Based on the file listing, the core files and areas to be audited and modified are:

### 🟢 Tier 1: Core Entities & APIs (Backend)
These files define the data structure and API routes and must be updated first to ensure the backend data models support the new naming conventions.

*   `src/entities/catalogs/`: All files defining the Catalog entity (e.g., `models`, `services`). This is the primary target for "catalog with feed" $\rightarrow$ "feed".
    *   `src/entities/catalogs/index.ts`
    *   `src/entities/catalogs/models/index.ts`
    *   `src/entities/catalogs/services/`: All service files here.
*   `src/entities/archives/`: All files defining the Archive entity. This needs review for "archive with list" $\rightarrow$ "list".
    *   `src/entities/archives/index.ts`
    *   `src/entities/archives/models/index.ts`
    *   `src/entities/archives/services/`: All service files here.
*   `src/app/api/catalogs/`: API routes for catalogs.
    *   `src/app/api/catalogs/route.ts`
    *   `src/app/api/catalogs/[catalogId]/route.ts` (and related files)
*   `src/app/api/archives/`: API routes for archives.
    *   `src/app/api/archives/route.ts`
    *   `src/app/api/archives/[archiveId]/route.ts` (and related files)

### 🔵 Tier 2: State Management & Shared Logic (Middleware)
These files hold global state and utility functions that might import/use the renamed entities.

*   `src/stores/catalog-store.ts`: State management for catalogs. Must be updated to reflect the new "feed" concept.
*   `src/shared/types-schema/`: Global type definitions. Check for any inherited types referring to the old names.
*   `src/shared/lib/`: Utility/API wrappers. Check for general API/data library usage related to the old names.

### 🟡 Tier 3: Views & Components (Frontend)
These files render the UI and call the backend APIs/use global state. They will need to be updated to reflect changes from Tier 1 and Tier 2.

*   **Frontend Views:**
    *   `src/views/public-catalog/`: Primary view for catalogs. Rename/refactor to `public-feed`.
    *   `src/views/public-archive/`: Primary view for archives. Rename/refactor based on the "list" concept.
    *   `src/views/edit-catalog/`: Catalog editing view.
    *   `src/views/edit-archive/`: Archive editing view.
*   **Frontend React/Next.js Pages:**
    *   `src/app/(views)/(public-catalog)/`: Next.js route directory.
    *   `src/app/(views)/(public-archive)/`: Next.js route directory.

## ⚙️ Step-by-Step Execution Plan

**Phase 1: Backend Renaming (Data Model Layer)**

1.  **Rename Catalog Logic (Catalog $\rightarrow$ Feed):**
    *   Rename the concept of `catalog` to `feed` in `src/entities/catalogs`.
    *   Update field names, function names, and internal logic across all files in `src/entities/catalogs/` to align with the `feed` terminology.
    *   Update the API routes in `src/app/api/catalogs/` to mirror the new `feed` logic and endpoint paths.
2.  **Rename Archive Logic (Archive $\rightarrow$ List/Review):**
    *   Determine the exact replacement for "archive with list". If 'list' refers to the viewing mode, modify the terminology. For now, will search for common API usage related to archives and rename related concepts or view/list-specific functions.
    *   Update entity models and services in `src/entities/archives/` where the renaming is required.

**Phase 2: Shared Logic & State Migration**

1.  **Update State:** Modify `src/stores/catalog-store.ts` (eventually renamed to `feed-store.ts`?) to manage the new `feed` entity state.
2.  **Update Types:** Review `src/shared/types-schema/` to ensure all interfaces and types related to the old names are updated.

**Phase 3: Frontend Refactoring (Presentation Layer)**

1.  **Rename Front-end Modules:**
    *   Rename directory/view structure from `src/app/(views)/(public-catalog)` to `src/app/(views)/(public-feed)`.
    *   Rename relevant components and hooks that handle the catalog logic to use `feed` terminology.
2.  **Update UI Components:** Iterate through all components in `src/views/public-catalog` and its dependencies, updating displayed text and API calls to use the new `feed` endpoints/data structures.
3.  **Complete Archive Renaming:** Apply equivalent steps to the `public-archive` view based on the final decision for the "archive with list" concept.

This plan provides a structured, phased approach, starting from the data foundation (Backend) and proceeding to the presentation layer (Frontend). I will now begin with Phase 1 by inspecting the contents of the most relevant files.