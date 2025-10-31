# Podcast Audio Generator

Converts course MDX/Markdown content into podcast-style conversational audio using Google's Gemini API.

## Features

- **Two-speaker dialogue**: Converts technical documentation into natural conversations between Alex (instructor) and Sam (senior engineer)
- **Gemini 2.5 Flash**: Uses latest models for dialogue generation and TTS
- **Multi-speaker TTS**: Natural voice synthesis with distinct speaker voices
- **Automatic processing**: Scans all course content and generates audio files
- **Manifest generation**: Creates JSON manifest mapping docs to audio URLs

## Prerequisites

- Node.js 20+
- Google Gemini API key
- Course content in `website/docs/` directory

## Setup

1. **Get API Key**: Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/)

2. **Set Environment Variable**:
   ```bash
   export GOOGLE_API_KEY="your-api-key-here"
   # OR
   export GEMINI_API_KEY="your-api-key-here"
   # OR
   export GCP_API_KEY="your-api-key-here"
   ```

3. **Install Dependencies** (already done if you ran setup):
   ```bash
   cd scripts
   npm install
   ```

## Usage

### From website directory:
```bash
cd website
npm run generate-podcast
```

### From scripts directory:
```bash
cd scripts
npm run generate-podcast
```

### Direct execution:
```bash
cd scripts
node generate-podcast.js
```

## Output

- **Audio files**: `website/static/audio/[lesson-path]/[filename].wav`
- **Manifest**: `website/static/audio/manifest.json`

### Manifest Structure

```json
{
  "understanding-the-tools/lesson-1-intro.md": {
    "audioUrl": "/audio/understanding-the-tools/lesson-1-intro.wav",
    "size": 1234567,
    "format": "audio/wav",
    "generatedAt": "2025-10-29T12:34:56.789Z"
  }
}
```

## Processing Pipeline

1. **Content Discovery**: Scans `website/docs/` for .md/.mdx files
2. **Content Parsing**: Strips frontmatter, JSX, code blocks
3. **Dialogue Generation**: Uses Gemini 2.5 Flash to create conversational script
4. **Audio Synthesis**: Uses Gemini 2.5 Flash TTS with multi-speaker config
5. **File Output**: Saves WAV files and updates manifest

## Configuration

### Models
- **Dialogue**: `gemini-2.5-flash` (text generation)
- **TTS**: `gemini-2.5-flash-preview-tts` (audio synthesis)

### Speakers
- **Alex**: "Kore" voice (firm, professional)
- **Sam**: "Charon" voice (neutral, professional)

### Rate Limiting
- 2-second delay between files to avoid API rate limits
- Sequential processing (not parallel)

## Cost Estimation

Using Gemini 2.5 Flash pricing:
- **Text generation**: $0.50 per 1M tokens
- **Audio output**: $10.00 per 1M tokens

Estimated cost for full course (12 lessons):
- **~$0.50-1.50** total (assuming ~200KB content)

## Utility Scripts

### fix-wav-files.js
Repairs corrupted WAV files (adds missing headers to raw PCM data):

```bash
cd scripts
node fix-wav-files.js
```

This creates `.bak` backups and adds proper RIFF/WAV headers to headerless PCM files.

## Troubleshooting

### "No API key found"
Set one of the environment variables: `GOOGLE_API_KEY`, `GEMINI_API_KEY`, or `GCP_API_KEY`

### "Module not found"
Run `npm install` in the scripts directory

### Corrupted/unplayable WAV files
Gemini API returns raw PCM data without WAV headers. The script now automatically adds headers, but if you have old files, run:
```bash
node fix-wav-files.js
```

### Audio quality issues
The Gemini 2.5 Flash TTS model is in preview and may have some background noise in long generations (known issue as of October 2025)

### Rate limit errors
Increase the delay between files in the script (currently 2000ms)

## Development

### Test with single file
Modify the script to process only one file for testing:

```javascript
// In main(), after finding files:
const files = findMarkdownFiles(DOCS_DIR).slice(0, 1); // Test first file only
```

### Skip CLAUDE.md
The script automatically skips `CLAUDE.md` files (project instructions)

## Related Documentation

- [Gemini API - Speech Generation](https://ai.google.dev/gemini-api/docs/speech-generation)
- [Gemini API - Models](https://ai.google.dev/gemini-api/docs/models)
- [Gemini API - Pricing](https://ai.google.dev/gemini-api/docs/pricing)
