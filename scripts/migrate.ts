#! /usr/bin/env tsx

/**
 * Migration Script: Add isPublic field to existing catalogs and archives documents
 *
 * This script adds the isPublic field (set to true) to all existing documents
 * in the catalogs and archives collections that don't already have this field.
 *
 * Usage:
 *   npm run migrate:local  # Apply changes to local emulator
 *   npm run migrate        # Apply changes to production
 */

import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { FieldPath } from 'firebase-admin/firestore';

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { credential } from 'firebase-admin';

// Check if this is a local run
const IS_LOCAL = process.argv.includes('--local') || process.env.NODE_ENV === 'development';
const BATCH_SIZE = 100;

// Initialize Firebase Admin
import type { AppOptions } from 'firebase-admin/app';

let appOptions: AppOptions;

if (IS_LOCAL) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

  appOptions = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ingest-dev',
  };
} else {
  // Production configuration with service account
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    appOptions = {
      credential: credential.cert({
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.split(String.raw`\n`).join("\n"),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ingest-dev',
      }),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ingest-dev',
    };
  } else {
    throw new Error('Production mode requires FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables.');
  }
}

const app = initializeApp(appOptions);

const admin = {
  db: getFirestore(app),
};

const refs = {
  catalogs: admin.db.collection('catalogs'),
  archives: admin.db.collection('archives'),
};

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
      let query = refs.catalogs.orderBy(FieldPath.documentId()).limit(BATCH_SIZE);
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
          batch.update(doc.ref, { isPublic: true });
          batchUpdates++;
        }
      }

      if (batchUpdates > 0) {
        await batch.commit();
      }

      lastDoc = snapshot.docs[snapshot.docs.length - 1];
      batchCount++;
      hasMore = snapshot.docs.length === BATCH_SIZE;

      console.log(`  ✓ Batch ${batchCount} (${snapshot.docs.length} docs)`);
    }
  } catch (_error) {
    const errorMsg = `Catalogs error: ${_error}`;
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
      let query = refs.archives.orderBy(FieldPath.documentId()).limit(BATCH_SIZE);
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
          batch.update(doc.ref, { isPublic: true });
          batchUpdates++;
        }
      }

      if (batchUpdates > 0) {
        await batch.commit();
      }

      lastDoc = snapshot.docs[snapshot.docs.length - 1];
      batchCount++;
      hasMore = snapshot.docs.length === BATCH_SIZE;

      console.log(`  ✓ Batch ${batchCount} (${snapshot.docs.length} docs)`);
    }
  } catch (_error) {
    const errorMsg = `Archives error: ${_error}`;
    console.error('❌', errorMsg);
    errors.push(errorMsg);
  }
}

/**
 * Main migration function
 */
async function migrate(): Promise<void> {
  console.log('🚀 Starting isPublic migration...');
  console.log(`Mode: ${IS_LOCAL ? 'LOCAL UPDATE' : 'PRODUCTION UPDATE'}`);
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
    console.log(`📚 Catalogs: ${catalogsScanned} scanned, ${catalogsUpdated} updated`);
    console.log(`📁 Archives: ${archivesScanned} scanned, ${archivesUpdated} updated`);
    console.log(`🌟 Total: ${totalScanned} scanned, ${totalUpdated} updated`);
    console.log(`⏱️  Duration: ${duration}s`);

    if (errors.length > 0) {
      console.log(`❌ Errors: ${errors.length}`);
      errors.forEach(error => console.log(`   ${error}`));
    }

    console.log('\n✅ Migration completed!');

  } catch (_error) {
    console.error('❌ Migration failed:', _error);
    process.exit(1);
  }
}

// Run migration
migrate().catch(console.error);
