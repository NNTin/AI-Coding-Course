#!/usr/bin/env node

/**
 * Podcast Audio Synthesis Script
 *
 * Converts saved podcast scripts (markdown files) to audio using Gemini TTS:
 * 1. Scans scripts/output/podcasts/ for markdown script files
 * 2. Parses script dialog and metadata
 * 3. Synthesizes audio using Gemini 2.5 Flash TTS with multi-speaker config
 * 4. Saves WAV files to website/static/audio/
 * 5. Updates manifest mapping docs to audio URLs
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SCRIPT_INPUT_DIR = join(__dirname, 'output/podcasts');
const AUDIO_OUTPUT_DIR = join(__dirname, '../website/static/audio');
const AUDIO_MANIFEST_PATH = join(AUDIO_OUTPUT_DIR, 'manifest.json');

// Model name for TTS - Pro model for highest quality podcast audio
const TTS_MODEL = 'gemini-2.5-pro-preview-tts';

// API key from environment
const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GCP_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: No API key found');
  console.error('Set GOOGLE_API_KEY, GEMINI_API_KEY, or GCP_API_KEY environment variable');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Parse markdown script file
 * Extracts frontmatter and dialog content
 */
function parseScriptFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');

  // Extract frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) {
    throw new Error('Invalid script format - missing frontmatter');
  }

  // Parse frontmatter (simple YAML parsing for our specific structure)
  const frontmatter = {};
  const frontmatterText = frontmatterMatch[1];

  // Extract simple key-value pairs
  frontmatter.source = frontmatterText.match(/source:\s*(.+)/)?.[1]?.trim() || '';
  frontmatter.generatedAt = frontmatterText.match(/generatedAt:\s*(.+)/)?.[1]?.trim() || '';
  frontmatter.model = frontmatterText.match(/model:\s*(.+)/)?.[1]?.trim() || '';
  frontmatter.tokenCount = parseInt(frontmatterText.match(/tokenCount:\s*(\d+)/)?.[1] || '0', 10);

  // Extract dialog content (everything after frontmatter)
  const dialog = content.slice(frontmatterMatch[0].length).trim();

  return {
    frontmatter,
    dialog
  };
}

/**
 * Estimate audio duration from text
 * Based on typical speech rate: ~150 words/min, ~5 chars/word = ~750 chars/min
 */
function estimateDuration(text) {
  const CHARS_PER_MINUTE = 750;
  const chars = text.length;
  return (chars / CHARS_PER_MINUTE) * 60; // Return seconds
}

/**
 * Split dialogue into chunks at speaker boundaries
 * Target: ~5 minutes per chunk (300 seconds) to stay well under 655 second limit
 */
function chunkDialogue(dialogue) {
  const TARGET_CHUNK_DURATION = 300; // 5 minutes in seconds
  const MAX_CHUNK_DURATION = 600;    // 10 minutes max (safety margin)

  const lines = dialogue.split('\n');
  const chunks = [];
  let currentChunk = [];
  let currentDuration = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      currentChunk.push(line);
      continue;
    }

    // Check if this is a speaker line (starts with "Alex:" or "Sam:")
    const isSpeakerLine = /^(Alex|Sam):/.test(trimmedLine);
    const lineDuration = estimateDuration(line);

    // If adding this line would exceed target AND we have content, start new chunk
    if (currentDuration + lineDuration > TARGET_CHUNK_DURATION &&
        currentChunk.length > 0 &&
        isSpeakerLine) {
      // Save current chunk
      chunks.push(currentChunk.join('\n'));
      currentChunk = [line];
      currentDuration = lineDuration;
    } else {
      currentChunk.push(line);
      currentDuration += lineDuration;

      // Hard limit safety check
      if (currentDuration > MAX_CHUNK_DURATION) {
        console.warn(`  ⚠️  Chunk exceeds max duration (${(currentDuration/60).toFixed(1)} min), forcing split`);
        chunks.push(currentChunk.join('\n'));
        currentChunk = [];
        currentDuration = 0;
      }
    }
  }

  // Add remaining chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n'));
  }

  return chunks;
}

/**
 * Find all markdown script files recursively
 */
function findScriptFiles(dir) {
  if (!existsSync(dir)) {
    console.warn(`⚠️  Script directory not found: ${dir}`);
    return [];
  }

  const files = [];

  function traverse(currentDir) {
    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.match(/\.md$/i) && item !== 'manifest.json') {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files.sort();
}

/**
 * Create WAV header for raw PCM data
 * Gemini TTS returns headerless 16-bit PCM @ 24kHz mono
 */
function createWavHeader(pcmDataLength) {
  const header = Buffer.alloc(44);

  // RIFF chunk descriptor
  header.write('RIFF', 0);                          // ChunkID
  header.writeUInt32LE(36 + pcmDataLength, 4);     // ChunkSize
  header.write('WAVE', 8);                          // Format

  // fmt subchunk
  header.write('fmt ', 12);                         // Subchunk1ID
  header.writeUInt32LE(16, 16);                    // Subchunk1Size (PCM = 16)
  header.writeUInt16LE(1, 20);                     // AudioFormat (PCM = 1)
  header.writeUInt16LE(1, 22);                     // NumChannels (mono = 1)
  header.writeUInt32LE(24000, 24);                 // SampleRate (24kHz)
  header.writeUInt32LE(24000 * 1 * 2, 28);         // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  header.writeUInt16LE(1 * 2, 32);                 // BlockAlign (NumChannels * BitsPerSample/8)
  header.writeUInt16LE(16, 34);                    // BitsPerSample (16-bit)

  // data subchunk
  header.write('data', 36);                         // Subchunk2ID
  header.writeUInt32LE(pcmDataLength, 40);         // Subchunk2Size

  return header;
}

/**
 * Retry a function with exponential backoff for transient errors
 */
async function retryWithBackoff(fn, maxAttempts = 4) {
  let lastError;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if error is retryable (transient network/API errors)
      const isRetryable =
        error.message?.includes('fetch failed') ||
        error.message?.includes('ECONNRESET') ||
        error.message?.includes('ETIMEDOUT') ||
        error.message?.includes('ENOTFOUND') ||
        error.status === 429 ||  // Rate limit
        error.status === 500 ||  // Internal server error
        error.status === 503 ||  // Service unavailable
        error.status === 504;    // Gateway timeout

      // Don't retry permanent errors (auth, permission, not found)
      const isPermanent =
        error.status === 400 ||  // Bad request
        error.status === 401 ||  // Unauthorized
        error.status === 403 ||  // Forbidden
        error.status === 404;    // Not found

      if (isPermanent) {
        throw error;  // Fail fast on permanent errors
      }

      if (!isRetryable || attempt === maxAttempts - 1) {
        throw lastError;  // Last attempt or non-retryable error
      }

      // Exponential backoff: 1s, 2s, 4s, 8s
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`  ⏳ Retry ${attempt + 1}/${maxAttempts} after ${delay}ms (${error.message})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Count tokens in dialogue text using Gemini API
 */
async function countDialogueTokens(dialogue) {
  const model = genAI.getGenerativeModel({ model: TTS_MODEL });

  const result = await model.countTokens({
    contents: [{
      role: 'user',
      parts: [{ text: dialogue }]
    }]
  });

  return result.totalTokens;
}

/**
 * Generate audio for a single dialogue chunk
 */
async function generateAudioChunk(dialogue, chunkIndex, totalChunks) {
  const chunkLabel = totalChunks > 1 ? ` (chunk ${chunkIndex + 1}/${totalChunks})` : '';
  console.log(`  🎙️  Synthesizing audio${chunkLabel}...`);

  // Validate token count before attempting TTS
  const tokenCount = await countDialogueTokens(dialogue);
  const TOKEN_LIMIT = 8192;
  const TOKEN_SAFETY_MARGIN = 500;
  const MAX_TOKENS = TOKEN_LIMIT - TOKEN_SAFETY_MARGIN;

  const estimatedSeconds = estimateDuration(dialogue);
  console.log(`  📊 Chunk${chunkLabel}: ${tokenCount} tokens, ~${(estimatedSeconds / 60).toFixed(1)} min`);

  if (tokenCount > MAX_TOKENS) {
    throw new Error(`Chunk exceeds token limit: ${tokenCount} > ${MAX_TOKENS}. Split into smaller chunks.`);
  }

  // Wrap TTS API call with retry logic
  const result = await retryWithBackoff(async () => {
    const model = genAI.getGenerativeModel({
      model: TTS_MODEL,
    });

    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: dialogue }]
      }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'Alex',
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: 'Kore' // Firm, professional voice
                  }
                }
              },
              {
                speaker: 'Sam',
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: 'Charon' // Neutral, professional voice
                  }
                }
              }
            ]
          }
        }
      }
    });

    // Guarded response parsing - validate structure before accessing
    if (!response?.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      throw new Error('TTS API returned malformed response - missing inlineData.data');
    }

    return response;
  });

  const audioData = result.response.candidates[0].content.parts[0].inlineData;

  // Decode base64 audio (raw PCM data, no header)
  const pcmBuffer = Buffer.from(audioData.data, 'base64');

  console.log(`  ✅ Chunk${chunkLabel} complete: ${(pcmBuffer.length / 1024 / 1024).toFixed(2)} MB`);

  return {
    pcmBuffer,
    tokenCount
  };
}

/**
 * Convert dialogue text to audio using multi-speaker TTS
 * Handles long content by splitting into chunks and concatenating
 */
async function generateAudio(dialogue, outputPath) {
  const totalDuration = estimateDuration(dialogue);
  console.log(`  📏 Total estimated duration: ~${(totalDuration / 60).toFixed(1)} minutes`);

  // Split dialogue into manageable chunks
  const chunks = chunkDialogue(dialogue);

  if (chunks.length > 1) {
    console.log(`  ✂️  Split into ${chunks.length} chunks for processing`);
  }

  // Generate audio for each chunk
  const pcmBuffers = [];
  let totalTokens = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunkResult = await generateAudioChunk(chunks[i], i, chunks.length);
    pcmBuffers.push(chunkResult.pcmBuffer);
    totalTokens += chunkResult.tokenCount;
  }

  // Concatenate all PCM data
  const combinedPcm = Buffer.concat(pcmBuffers);

  // Create WAV header for the combined PCM data
  const wavHeader = createWavHeader(combinedPcm.length);

  // Combine header + PCM data to create valid WAV file
  const wavBuffer = Buffer.concat([wavHeader, combinedPcm]);

  // Ensure output directory exists
  mkdirSync(dirname(outputPath), { recursive: true });

  writeFileSync(outputPath, wavBuffer);

  console.log(`  ✅ Audio saved: ${(wavBuffer.length / 1024 / 1024).toFixed(2)} MB, ${totalTokens} tokens`);

  return {
    size: wavBuffer.length,
    format: 'audio/wav',
    tokenCount: totalTokens,
    chunks: chunks.length
  };
}

/**
 * Process a single script file
 */
async function processScript(scriptPath, manifest) {
  const relativePath = relative(SCRIPT_INPUT_DIR, scriptPath);
  const fileName = basename(scriptPath, extname(scriptPath));

  console.log(`\n📄 Processing script: ${relativePath}`);

  try {
    // Parse script
    const { frontmatter, dialog } = parseScriptFile(scriptPath);

    console.log(`  📝 Source doc: ${frontmatter.source}`);
    console.log(`  📊 Estimated tokens: ${frontmatter.tokenCount || 'unknown'}`);

    // Determine audio output path (mirror structure from script path)
    const relativeDir = dirname(relativePath);
    const outputFileName = `${fileName}.wav`;
    const outputPath = join(AUDIO_OUTPUT_DIR, relativeDir, outputFileName);

    // Generate audio
    const audioInfo = await generateAudio(dialog, outputPath);

    // Update manifest using the source doc path as key
    const audioUrl = `/audio/${join(relativeDir, outputFileName)}`;
    manifest[frontmatter.source] = {
      audioUrl,
      size: audioInfo.size,
      format: audioInfo.format,
      tokenCount: audioInfo.tokenCount,
      chunks: audioInfo.chunks,
      generatedAt: new Date().toISOString(),
      scriptSource: relativePath
    };

    console.log(`  ✅ Generated: ${audioUrl}`);
    console.log(`  📊 Audio size: ${(audioInfo.size / 1024 / 1024).toFixed(2)} MB`);
    if (audioInfo.chunks > 1) {
      console.log(`  🧩 Chunks: ${audioInfo.chunks}`);
    }

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    console.error(`  Skipping this file and continuing...`);
  }
}

/**
 * Process files with concurrency limit
 */
async function processFilesWithConcurrency(files, manifest, concurrency = 3) {
  const results = { processed: 0, failed: 0 };

  // Process files in batches
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);

    console.log(`\n🔄 Processing batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(files.length / concurrency)} (${batch.length} files concurrently)...`);

    // Process batch concurrently
    await Promise.all(
      batch.map(async (file) => {
        try {
          await processScript(file, manifest);
          results.processed++;
        } catch (error) {
          console.error(`\n❌ Failed to process ${file}:`, error.message);
          results.failed++;
        }
      })
    );
  }

  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log('🎵 AI Coding Course - Podcast Audio Generator\n');
  console.log(`📂 Script input: ${SCRIPT_INPUT_DIR}`);
  console.log(`🔊 Audio output: ${AUDIO_OUTPUT_DIR}`);
  console.log(`🎵 TTS model: ${TTS_MODEL}`);

  // Find all script files
  const files = findScriptFiles(SCRIPT_INPUT_DIR);

  if (files.length === 0) {
    console.error('\n❌ No script files found. Run generate-podcast-script.js first.');
    process.exit(1);
  }

  console.log(`\n📚 Found ${files.length} script files\n`);

  // Load existing manifest or create new
  let manifest = {};
  if (existsSync(AUDIO_MANIFEST_PATH)) {
    manifest = JSON.parse(readFileSync(AUDIO_MANIFEST_PATH, 'utf-8'));
    console.log(`📋 Loaded existing manifest with ${Object.keys(manifest).length} entries\n`);
  }

  // Process files with concurrency limit of 3
  const results = await processFilesWithConcurrency(files, manifest, 3);

  // Save manifest
  mkdirSync(dirname(AUDIO_MANIFEST_PATH), { recursive: true });
  writeFileSync(AUDIO_MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('✨ Audio generation complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   ✅ Processed: ${results.processed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   📁 Total files: ${files.length}`);
  console.log(`\n📋 Manifest saved to: ${AUDIO_MANIFEST_PATH}`);
  console.log('='.repeat(60));
}

// Run
main().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
