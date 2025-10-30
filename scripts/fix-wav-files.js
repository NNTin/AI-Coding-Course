#!/usr/bin/env node

/**
 * Fix existing WAV files by adding proper headers
 * Converts raw PCM data to valid WAV format
 */

import { readdirSync, readFileSync, writeFileSync, statSync, renameSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const AUDIO_OUTPUT_DIR = join(__dirname, '../website/static/audio');

function createWavHeader(pcmDataLength) {
  const header = Buffer.alloc(44);

  // RIFF chunk descriptor
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmDataLength, 4);
  header.write('WAVE', 8);

  // fmt subchunk
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(24000, 24);
  header.writeUInt32LE(24000 * 1 * 2, 28);
  header.writeUInt16LE(1 * 2, 32);
  header.writeUInt16LE(16, 34);

  // data subchunk
  header.write('data', 36);
  header.writeUInt32LE(pcmDataLength, 40);

  return header;
}

function findWavFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.wav')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function isValidWav(buffer) {
  if (buffer.length < 12) return false;
  const header = buffer.slice(0, 12).toString('ascii', 0, 12);
  return header.startsWith('RIFF') && header.includes('WAVE');
}

async function fixWavFile(filePath) {
  console.log(`\n📄 ${filePath}`);

  const buffer = readFileSync(filePath);

  // Check if already valid
  if (isValidWav(buffer)) {
    console.log('  ✅ Already valid WAV file - skipping');
    return { status: 'skipped', path: filePath };
  }

  console.log('  🔧 Adding WAV header...');

  // Buffer is raw PCM - add WAV header
  const wavHeader = createWavHeader(buffer.length);
  const wavBuffer = Buffer.concat([wavHeader, buffer]);

  // Backup original
  const backupPath = filePath + '.bak';
  renameSync(filePath, backupPath);

  // Write fixed file
  writeFileSync(filePath, wavBuffer);

  // Verify
  const verifyBuffer = readFileSync(filePath);
  if (isValidWav(verifyBuffer)) {
    console.log('  ✅ Fixed successfully');
    console.log(`     Original: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`     Fixed: ${(wavBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`     Backup: ${backupPath}`);
    return { status: 'fixed', path: filePath, backup: backupPath };
  } else {
    console.log('  ❌ Fix failed - restoring backup');
    renameSync(backupPath, filePath);
    return { status: 'failed', path: filePath };
  }
}

async function main() {
  console.log('🔧 WAV File Repair Utility\n');
  console.log(`📂 Audio directory: ${AUDIO_OUTPUT_DIR}\n`);

  const files = findWavFiles(AUDIO_OUTPUT_DIR);
  console.log(`Found ${files.length} WAV files\n`);

  if (files.length === 0) {
    console.log('No WAV files to process.');
    return;
  }

  console.log('='.repeat(60));

  const results = { fixed: 0, skipped: 0, failed: 0 };

  for (const file of files) {
    try {
      const result = await fixWavFile(file);
      results[result.status]++;
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      results.failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`   ✅ Fixed: ${results.fixed}`);
  console.log(`   ⏭️  Skipped (already valid): ${results.skipped}`);
  console.log(`   ❌ Failed: ${results.failed}`);

  if (results.fixed > 0) {
    console.log('\n💡 Tip: .bak files can be deleted after verifying audio playback');
  }

  console.log('\n✨ Done!\n');
}

main().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
