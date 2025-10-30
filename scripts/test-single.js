#!/usr/bin/env node

/**
 * Test script - generate audio for a single file
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, '../website/docs');
const AUDIO_OUTPUT_DIR = join(__dirname, '../website/static/audio');
const TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const DIALOGUE_MODEL = 'gemini-2.5-flash';

const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GCP_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: No API key found');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

function createWavHeader(pcmDataLength) {
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmDataLength, 4);
  header.write('WAVE', 8);

  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(24000, 24);
  header.writeUInt32LE(24000 * 1 * 2, 28);
  header.writeUInt16LE(1 * 2, 32);
  header.writeUInt16LE(16, 34);

  header.write('data', 36);
  header.writeUInt32LE(pcmDataLength, 40);

  return header;
}

async function generateAudio(dialogue, outputPath) {
  console.log(`🎙️  Synthesizing audio...`);

  const model = genAI.getGenerativeModel({ model: TTS_MODEL });

  const result = await model.generateContent({
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
                prebuiltVoiceConfig: { voiceName: 'Kore' }
              }
            },
            {
              speaker: 'Sam',
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Puck' }
              }
            }
          ]
        }
      }
    }
  });

  const audioData = result.response.candidates[0].content.parts[0].inlineData;
  const pcmBuffer = Buffer.from(audioData.data, 'base64');
  const wavHeader = createWavHeader(pcmBuffer.length);
  const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, wavBuffer);

  return { size: wavBuffer.length, pcmSize: pcmBuffer.length };
}

// Test with a simple dialogue
const testDialogue = `Alex: Welcome to our AI Coding Course!
Sam: Thanks for having me! I'm excited to learn about AI-driven development.
Alex: Great! Let's dive into how AI agents can help senior engineers work more efficiently.
Sam: That sounds really practical. I'm ready when you are.`;

const outputPath = join(AUDIO_OUTPUT_DIR, 'test-output.wav');

console.log('🧪 Testing WAV generation...\n');
console.log('Input dialogue:');
console.log(testDialogue);
console.log('\n' + '='.repeat(60) + '\n');

try {
  const result = await generateAudio(testDialogue, outputPath);
  console.log(`\n✅ Success!`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   PCM size: ${(result.pcmSize / 1024).toFixed(2)} KB`);
  console.log(`   WAV size: ${(result.size / 1024).toFixed(2)} KB (with header)`);
  console.log('\nVerifying file...');

  // Verify the file
  const testBuffer = readFileSync(outputPath);
  const header = testBuffer.slice(0, 12).toString();

  if (header.startsWith('RIFF') && header.includes('WAVE')) {
    console.log('✅ Valid WAV file structure detected!');
  } else {
    console.log('❌ Invalid WAV header');
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
