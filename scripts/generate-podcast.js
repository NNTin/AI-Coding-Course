#!/usr/bin/env node

/**
 * Podcast Audio Generation Script
 *
 * Converts MDX course content to podcast-style audio using Gemini API:
 * 1. Scans all MDX files in website/docs/
 * 2. Converts technical content to conversational two-speaker dialogue
 * 3. Generates audio using Gemini 2.5 Flash TTS
 * 4. Saves to website/static/audio/
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const DOCS_DIR = join(__dirname, '../website/docs');
const AUDIO_OUTPUT_DIR = join(__dirname, '../website/static/audio');
const MANIFEST_PATH = join(AUDIO_OUTPUT_DIR, 'manifest.json');

// Model names
const DIALOGUE_MODEL = 'gemini-2.5-flash';
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';

// API key from environment
const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GCP_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: No API key found');
  console.error('Set GOOGLE_API_KEY, GEMINI_API_KEY, or GCP_API_KEY environment variable');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Parse MDX/MD file and extract clean text content
 * Strips frontmatter, JSX components, and code blocks
 */
function parseMarkdownContent(filePath) {
  const content = readFileSync(filePath, 'utf-8');

  // Remove frontmatter
  let cleaned = content.replace(/^---[\s\S]*?---\n/, '');

  // Remove JSX components (simple approach - remove anything with <>)
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // Extract text from code blocks but label them
  cleaned = cleaned.replace(/```[\s\S]*?```/g, (match) => {
    return '[Code example omitted for audio]';
  });

  // Remove inline code
  cleaned = cleaned.replace(/`[^`]+`/g, (match) => match.replace(/`/g, ''));

  // Remove images
  cleaned = cleaned.replace(/!\[.*?\]\(.*?\)/g, '[Image]');

  // Clean up markdown links but keep text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // Clean up excessive whitespace
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}

/**
 * Find all MDX/MD files recursively
 */
function findMarkdownFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = readdirSync(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.match(/\.(md|mdx)$/i) && !item.includes('CLAUDE.md')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files.sort();
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
 * Generate conversational dialogue from technical content
 */
async function generateDialogue(content, fileName, maxTokens = null) {
  console.log(`  🎭 Generating dialogue script...`);

  const model = genAI.getGenerativeModel({ model: DIALOGUE_MODEL });

  // Special handling for intro.md - add self-aware meta-commentary
  const isIntro = fileName === 'intro';
  const metaCommentary = isIntro ? `

SPECIAL INSTRUCTIONS FOR THIS EPISODE:
This is the course introduction. When discussing the section about how the course was developed using AI (including the podcast itself), have Alex and Sam briefly acknowledge in a natural, professional way that they themselves are AI-generated voices. This should feel like a thoughtful meta-moment, not gimmicky. Keep it concise - one or two exchanges where they note the self-referential nature of AI-generated hosts discussing AI-generated content. Make it feel authentic to how senior engineers would react to this realization.` : '';

  const lengthConstraint = maxTokens ? `

CRITICAL LENGTH REQUIREMENT:
The dialogue MUST be under ${maxTokens} tokens (approximately ${Math.floor(maxTokens * 4)} characters or ${Math.floor(maxTokens * 0.75)} words). This is a hard constraint due to TTS API limitations. Prioritize the most important concepts and keep explanations concise while maintaining quality.` : `

LENGTH GUIDELINE:
Aim for a concise dialogue under 7,000 tokens to ensure it fits within TTS API limits while maintaining quality.`;

  const prompt = `You are converting technical course content into a natural, engaging two-person podcast conversation.

Speakers:
- Alex: The instructor - knowledgeable, clear, measured teaching style
- Sam: Senior software engineer - thoughtful, asks clarifying questions, relates concepts to real-world scenarios

Guidelines:
- Keep the conversation natural and flowing, but maintain professional composure
- Conversational yet measured - avoid excessive enthusiasm or exclamations
- Sam should ask relevant, thoughtful questions that a senior engineer would ask
- Alex should explain concepts clearly but not patronizingly
- Include brief moments of insight or understanding
- Keep technical accuracy - don't dumb down the content
- Make it engaging but professional - prioritize clarity over energy
- Break down complex concepts through dialogue
- Reference real-world scenarios and examples${metaCommentary}${lengthConstraint}

Technical Content Title: ${fileName}

Technical Content:
${content}

Generate a natural podcast dialogue between Alex and Sam discussing this content. Format the output with clear speaker labels:

Alex: [dialogue]
Sam: [dialogue]
Alex: [dialogue]
...

Keep it conversational and engaging. Begin the dialogue now:`;

  const result = await model.generateContent(prompt);
  const dialogue = result.response.text();

  return dialogue;
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
 * @param {Function} fn - Async function to retry
 * @param {number} maxAttempts - Maximum retry attempts (default: 4)
 * @returns {Promise} - Result of successful function call
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
 * Convert dialogue text to audio using multi-speaker TTS
 */
async function generateAudio(dialogue, outputPath) {
  console.log(`  🎙️  Synthesizing audio...`);

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

  // Create WAV header for the raw PCM data
  const wavHeader = createWavHeader(pcmBuffer.length);

  // Combine header + PCM data to create valid WAV file
  const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);

  // Ensure output directory exists
  mkdirSync(dirname(outputPath), { recursive: true });

  writeFileSync(outputPath, wavBuffer);

  console.log(`  ✅ Audio synthesized successfully`);

  return {
    size: wavBuffer.length,
    format: 'audio/wav'
  };
}


/**
 * Process a single markdown file
 */
async function processFile(filePath, manifest) {
  const relativePath = relative(DOCS_DIR, filePath);
  const fileName = basename(filePath, extname(filePath));

  console.log(`\n📄 Processing: ${relativePath}`);

  try {
    // Parse content
    const content = parseMarkdownContent(filePath);

    if (content.length < 100) {
      console.log(`  ⚠️  Skipping - content too short`);
      return;
    }

    // Generate dialogue with retry logic for token limit
    const TOKEN_LIMIT = 8192;
    const TOKEN_SAFETY_MARGIN = 500;
    const MAX_TOKENS = TOKEN_LIMIT - TOKEN_SAFETY_MARGIN;

    const retryLimits = [
      { maxTokens: null, attempt: 0 },        // First try: soft guideline (7,000 tokens)
      { maxTokens: 7000, attempt: 1 },        // Retry 1: 7,000 tokens
      { maxTokens: 6000, attempt: 2 },        // Retry 2: 6,000 tokens
      { maxTokens: 5500, attempt: 3 },        // Retry 3: 5,500 tokens (last resort)
    ];

    let dialogue;
    let tokenCount;
    let attemptSucceeded = false;

    for (const { maxTokens, attempt } of retryLimits) {
      if (attempt > 0) {
        console.log(`  🔄 Retry ${attempt}: Regenerating with ${maxTokens} token limit...`);
      }

      dialogue = await generateDialogue(content, fileName, maxTokens);
      tokenCount = await countDialogueTokens(dialogue);

      console.log(`  📊 Token count: ${tokenCount} / ${MAX_TOKENS} (${((tokenCount / MAX_TOKENS) * 100).toFixed(1)}%)`);

      if (tokenCount <= MAX_TOKENS) {
        attemptSucceeded = true;
        if (attempt > 0) {
          console.log(`  ✅ Success on attempt ${attempt + 1}`);
        }
        break;
      } else {
        console.log(`  ⚠️  Exceeds limit by ${tokenCount - MAX_TOKENS} tokens`);
      }
    }

    if (!attemptSucceeded) {
      throw new Error(`Failed to generate dialogue within token limit after ${retryLimits.length} attempts. Final count: ${tokenCount} tokens`);
    }

    // Determine output path
    const outputFileName = `${fileName}.wav`;
    const outputPath = join(AUDIO_OUTPUT_DIR, dirname(relativePath), outputFileName);

    // Generate audio
    const audioInfo = await generateAudio(dialogue, outputPath);

    // Update manifest
    const audioUrl = `/audio/${relative(AUDIO_OUTPUT_DIR, outputPath)}`;
    manifest[relativePath] = {
      audioUrl,
      size: audioInfo.size,
      format: audioInfo.format,
      tokenCount: tokenCount,
      generatedAt: new Date().toISOString()
    };

    console.log(`  ✅ Generated: ${audioUrl}`);
    console.log(`  📊 Audio size: ${(audioInfo.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  📊 Tokens: ${tokenCount}`);

  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    console.error(`  Skipping this file and continuing...`);
  }
}

/**
 * Process files with concurrency limit
 * @param {string[]} files - Array of file paths to process
 * @param {Object} manifest - Manifest object to update
 * @param {number} concurrency - Max concurrent operations (default: 3)
 * @returns {Promise<{processed: number, failed: number}>}
 */
async function processFilesWithConcurrency(files, manifest, concurrency = 3) {
  const results = { processed: 0, failed: 0 };

  // Process files in batches of `concurrency`
  for (let i = 0; i < files.length; i += concurrency) {
    const batch = files.slice(i, i + concurrency);

    console.log(`\n🔄 Processing batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(files.length / concurrency)} (${batch.length} files concurrently)...`);

    // Process batch concurrently
    await Promise.all(
      batch.map(async (file) => {
        try {
          await processFile(file, manifest);
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
  console.log('🎙️  AI Coding Course - Podcast Generator\n');
  console.log(`📂 Docs directory: ${DOCS_DIR}`);
  console.log(`🔊 Audio output: ${AUDIO_OUTPUT_DIR}`);
  console.log(`🤖 Dialogue model: ${DIALOGUE_MODEL}`);
  console.log(`🎵 TTS model: ${TTS_MODEL}`);

  // Find all markdown files
  const files = findMarkdownFiles(DOCS_DIR);
  console.log(`\n📚 Found ${files.length} markdown files\n`);

  // Load existing manifest or create new
  let manifest = {};
  if (existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'));
    console.log(`📋 Loaded existing manifest with ${Object.keys(manifest).length} entries\n`);
  }

  // Process files with concurrency limit of 3
  const results = await processFilesWithConcurrency(files, manifest, 3);

  // Save manifest
  mkdirSync(dirname(MANIFEST_PATH), { recursive: true });
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('✨ Podcast generation complete!\n');
  console.log(`📊 Summary:`);
  console.log(`   ✅ Processed: ${results.processed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   📁 Total files: ${files.length}`);
  console.log(`\n📋 Manifest saved to: ${MANIFEST_PATH}`);
  console.log('='.repeat(60));
}

// Run
main().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
