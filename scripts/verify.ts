#!/usr/bin/env tsx

/**
 * Verification Script: Check isPublic field on catalogs and archives documents
 *
 * Verifies that all catalogs and archives documents have the isPublic field.
 *
 * Usage:
 *   npm run verify:local    # Check local emulator
 *   npm run verify          # Check production
 */

// Check if this is local run
const IS_LOCAL = process.argv.includes('--local');

if (IS_LOCAL) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
}

import type { CollectionReference, QueryDocumentSnapshot } from 'firebase-admin/firestore';

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ingest-dev',
});

const admin = {
  db: getFirestore(app),
};

const refs = {
  catalogs: admin.db.collection('catalogs'),
  archives: admin.db.collection('archives'),
};

const BATCH_SIZE = 100;

/**
 * Verify documents in a collection
 */
async function verifyCollectionDocuments(
  collectionRef: CollectionReference,
  name: string
): Promise<{ totalDocuments: number; withField: number; samples: Array<{ docId: string; hasField: boolean; value: boolean | undefined }> }> {
  console.log(`🔍 Checking ${name} documents...`);

  let totalDocuments = 0;
  let withField = 0;
  const samples: Array<{ docId: string; hasField: boolean; value: boolean | undefined }> = [];
  let lastDoc: QueryDocumentSnapshot | null = null;
  let hasMore = true;

  while (hasMore) {
    let query = collectionRef.limit(BATCH_SIZE);
    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    if (snapshot.empty) break;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      totalDocuments++;

      const hasField = data.isPublic !== undefined && data.isPublic !== null;
      if (hasField) withField++;

      // Collect first 3 samples
      if (samples.length < 3) {
        samples.push({
          docId: doc.id,
          hasField,
          value: data.isPublic
        });
      }
    }

    lastDoc = snapshot.docs[snapshot.docs.length - 1];
    hasMore = snapshot.docs.length === BATCH_SIZE;
  }

  return { totalDocuments, withField, samples };
}

/**
 * Main verification
 */
async function verify(): Promise<void> {
  console.log('🔍 Verifying isPublic migration...');
  console.log('---');

  try {
    const catalogResults = await verifyCollectionDocuments(refs.catalogs, 'catalogs');
    const archiveResults = await verifyCollectionDocuments(refs.archives, 'archives');

    const totalDocuments = catalogResults.totalDocuments + archiveResults.totalDocuments;
    const totalWithField = catalogResults.withField + archiveResults.withField;
    const missing = totalDocuments - totalWithField;

    console.log('\n' + '='.repeat(40));
    console.log('📊 VERIFICATION RESULTS');
    console.log('='.repeat(40));
    console.log(`📚 Catalog documents: ${catalogResults.withField}/${catalogResults.totalDocuments} have isPublic`);
    console.log(`📁 Archive documents: ${archiveResults.withField}/${archiveResults.totalDocuments} have isPublic`);
    console.log(`📄 Total documents: ${totalWithField}/${totalDocuments} have isPublic`);

    if (missing === 0) {
      console.log('\n✅ SUCCESS: All documents have isPublic field!');
    } else {
      console.log(`\n❌ MISSING: ${missing} documents need the isPublic field`);
      console.log('   Run: npm run migrate');
    }

    // Show samples
    console.log('\n📋 Sample documents:');
    [...catalogResults.samples, ...archiveResults.samples].forEach((sample, i) => {
      console.log(`  ${i + 1}. ${sample.docId}: isPublic=${sample.value}`);
    });

  } catch (_error) {
    console.error('❌ Verification failed:', _error);
    process.exit(1);
  }
}

verify().catch(console.error);
