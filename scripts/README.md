# Migration Scripts

Scripts to add the `isPublic` field to existing catalogs and archives documents.

## Quick Start

### 1. Preview Migration (ALWAYS run this first)

```bash
npm run migrate:is-public:dry-run
```

### 2. Run Full Migration

```bash
npm run migrate:is-public
```

### 3. Verify Results

```bash
npm run verify:is-public
```

## What it does

- ✅ Adds `isPublic: true` to all catalogs and archives without this field
- ✅ Preserves all existing data
- ✅ Safe to run multiple times
- ✅ Processes in batches for large collections

## Files

- `migrate.ts` - Main migration script
- `verify.ts` - Verification script

## Safety

The migration script:
- **Dry run mode** - Preview changes before applying
- **Batch processing** - Handles large collections safely
- **Error handling** - Reports issues without stopping
- **Idempotent** - Safe to run multiple times

## Expected Output

- **Dry run**: Shows how many documents need `isPublic` field
- **Migration**: Updates documents and shows progress
- **Verification**: Confirms all documents have the field
