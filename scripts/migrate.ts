#!/usr/bin/env tsx

/**
 * Migration Script: Add isPublic field to existing catalogs and archives
 * 
 * This script adds the isPublic field (set to true) to all existing documents
 * in the catalogs and archives collections that don't already have this field.
 * 
 * Usage:
 *   npm run migrate:is-public:dry-run  # Preview changes
 *   npm run migrate:is-public          # Apply changes
 */

import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

import { admin } from '~/shared/lib/firebase/admin';
import { refs } from '~/shared/lib/firebase/refs';

// Check if this is a dry run
const DRY_RUN = process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true';
const BATCH_SIZE = 100;

// Statistics
let catalogsScanned = 0;
let catalogsUpdated = 0;
let archivesScanned = 0;
let archivesUpdated = 0;
let errors: string[] = [];

/**
 * Migrate catalogs collection
 */
async function migrateCatalogs(): Promise<void> {
  console.log('📚 Migrating catalogs...');
  
  try {
    let lastDoc: QueryDocumentSnapshot | null = null;
    let hasMore = true;
    let batchCount = 0;

    while (hasMore) {
      let query = refs.catalogs.limit(BATCH_SIZE);
      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();
      if (snapshot.empty) break;

      const batch = admin.db.batch();
      let batchUpdates = 0;

      for (const doc of snapshot.docs) {
        catalogsScanned++;
        const data = doc.data();
        
        if (data.isPublic == null) {
          catalogsUpdated++;
          if (!DRY_RUN) {
            batch.update(doc.ref, { isPublic: true });
            batchUpdates++;
          }
        }
      }

      if (batchUpdates > 0 && !DRY_RUN) {
        await batch.commit();
      }

      lastDoc = snapshot.docs[snapshot.docs.length - 1];
      batchCount++;
      hasMore = snapshot.docs.length === BATCH_SIZE;
      
      console.log(`  ✓ Batch ${batchCount} (${snapshot.docs.length} docs)`);
    }
  } catch (error) {
    const errorMsg = `Catalogs error: ${error}`;
    console.error('❌', errorMsg);
    errors.push(errorMsg);
  }
}

/**
 * Migrate archives collection
 */
async function migrateArchives(): Promise<void> {
  console.log('📁 Migrating archives...');
  
  try {
    let lastDoc: QueryDocumentSnapshot | null = null;
    let hasMore = true;
    let batchCount = 0;

    while (hasMore) {
      let query = refs.archives.limit(BATCH_SIZE);
      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snapshot = await query.get();
      if (snapshot.empty) break;

      const batch = admin.db.batch();
      let batchUpdates = 0;

      for (const doc of snapshot.docs) {
        archivesScanned++;
        const data = doc.data();
        
        if (data.isPublic == null) {
          archivesUpdated++;
          if (!DRY_RUN) {
            batch.update(doc.ref, { isPublic: true });
            batchUpdates++;
          }
        }
      }

      if (batchUpdates > 0 && !DRY_RUN) {
        await batch.commit();
      }

      lastDoc = snapshot.docs[snapshot.docs.length - 1];
      batchCount++;
      hasMore = snapshot.docs.length === BATCH_SIZE;
      
      console.log(`  ✓ Batch ${batchCount} (${snapshot.docs.length} docs)`);
    }
  } catch (error) {
    const errorMsg = `Archives error: ${error}`;
    console.error('❌', errorMsg);
    errors.push(errorMsg);
  }
}

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
  console.log('🚀 Starting isPublic migration...');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (preview only)' : 'LIVE UPDATE'}`);
  console.log('---');

  const startTime = Date.now();

  try {
    await migrateCatalogs();
    await migrateArchives();
    
    const duration = Math.round((Date.now() - startTime) / 1000);
    const totalScanned = catalogsScanned + archivesScanned;
    const totalUpdated = catalogsUpdated + archivesUpdated;
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`📚 Catalogs: ${catalogsScanned} scanned, ${catalogsUpdated} ${DRY_RUN ? 'need updates' : 'updated'}`);
    console.log(`📁 Archives: ${archivesScanned} scanned, ${archivesUpdated} ${DRY_RUN ? 'need updates' : 'updated'}`);
    console.log(`🌟 Total: ${totalScanned} scanned, ${totalUpdated} ${DRY_RUN ? 'need updates' : 'updated'}`);
    console.log(`⏱️  Duration: ${duration}s`);
    
    if (errors.length > 0) {
      console.log(`❌ Errors: ${errors.length}`);
      errors.forEach(error => console.log(`   ${error}`));
    }
    
    if (DRY_RUN) {
      console.log('\n💡 This was a preview. Run without --dry-run to apply changes.');
    } else {
      console.log('\n✅ Migration completed!');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate().catch(console.error);