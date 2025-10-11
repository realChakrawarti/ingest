#!/usr/bin/env tsx

/**
 * Verification Script: Check isPublic field migration
 * 
 * Verifies that all documents have the isPublic field.
 * 
 * Usage:
 *   npm run verify:is-public
 */

import type { CollectionReference, QueryDocumentSnapshot } from 'firebase-admin/firestore';

import { refs } from '~/shared/lib/firebase/refs';

const BATCH_SIZE = 100;

/**
 * Verify a collection
 */
async function verifyCollection(
  collectionRef: CollectionReference, 
  name: string
): Promise<{ total: number; withField: number; samples: Array<{ id: string; hasField: boolean; value: boolean | undefined }> }> {
  console.log(`🔍 Checking ${name}...`);
  
  let total = 0;
  let withField = 0;
  const samples: Array<{ id: string; hasField: boolean; value: boolean | undefined }> = [];
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
      total++;
      const data = doc.data();
      
      if (data.isPublic !== undefined && data.isPublic !== null) {
        withField++;
      }

      // Collect first 3 samples
      if (samples.length < 3) {
        samples.push({
          id: doc.id,
          hasField: data.isPublic !== undefined,
          value: data.isPublic
        });
      }
    }

    lastDoc = snapshot.docs[snapshot.docs.length - 1];
    hasMore = snapshot.docs.length === BATCH_SIZE;
  }

  return { total, withField, samples };
}

/**
 * Main verification
 */
async function verify(): Promise<void> {
  console.log('🔍 Verifying isPublic migration...');
  console.log('---');

  try {
    const catalogResults = await verifyCollection(refs.catalogs, 'catalogs');
    const archiveResults = await verifyCollection(refs.archives, 'archives');
    
    const totalDocs = catalogResults.total + archiveResults.total;
    const totalWithField = catalogResults.withField + archiveResults.withField;
    const missing = totalDocs - totalWithField;

    console.log('\n' + '='.repeat(40));
    console.log('📊 VERIFICATION RESULTS');
    console.log('='.repeat(40));
    console.log(`📚 Catalogs: ${catalogResults.withField}/${catalogResults.total} have isPublic`);
    console.log(`📁 Archives: ${archiveResults.withField}/${archiveResults.total} have isPublic`);
    console.log(`🌟 Total: ${totalWithField}/${totalDocs} have isPublic`);

    if (missing === 0) {
      console.log('\n✅ SUCCESS: All documents have isPublic field!');
    } else {
      console.log(`\n❌ MISSING: ${missing} documents need the isPublic field`);
      console.log('   Run: npm run migrate:is-public');
    }

    // Show samples
    console.log('\n📋 Sample documents:');
    [...catalogResults.samples, ...archiveResults.samples].forEach((sample, i) => {
      console.log(`  ${i + 1}. ${sample.id}: isPublic=${sample.value}`);
    });

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  }
}

verify().catch(console.error);