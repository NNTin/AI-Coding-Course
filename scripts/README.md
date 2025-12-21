# Podcast Generation Scripts

Converts course MDX/Markdown content into podcast-style conversational audio using a two-stage pipeline:
1. **Script Generation**: Claude Haiku 4.5 generates engaging dialog (via Claude Code CLI)
2. **Audio Synthesis**: Gemini 2.5 Flash TTS converts scripts to audio

## Features

- **Two-speaker dialogue**: Converts technical documentation into natural conversations between Alex (instructor) and Sam (senior engineer)
- **Optimized for senior engineers**: Professional, engaging, argument-driven content based on educational podcast best practices
- **Separated concerns**: Generate scripts first, then audio - allows manual editing and version control
- **Multi-speaker TTS**: Natural voice synthesis with distinct speaker voices (Kore/Charon)
- **Automatic processing**: Scans all course content and processes systematically
- **Dual manifests**: Scripts manifest + audio manifest for tracking

## Prerequisites

- Node.js 20+
- **Claude Code CLI** installed and authenticated (`npm install -g @anthropic-ai/claude-code`)
- **Google Gemini API key** for TTS
- Course content in `website/docs/` directory

## Setup

### 1. Install Claude Code CLI
```bash
npm install -g @anthropic-ai/claude-code
claude  # Follow authentication prompts
```

### 2. Set Gemini API Key
```bash
export GOOGLE_API_KEY="your-api-key-here"
# OR
export GEMINI_API_KEY="your-api-key-here"
# OR
export GCP_API_KEY="your-api-key-here"
```

### 3. Install Dependencies
```bash
cd scripts
npm install
```

## Usage

### Complete Pipeline (Scripts + Audio)
```bash
cd scripts
npm run generate-podcast
```

This runs both stages sequentially.

### Stage 1: Generate Scripts Only
```bash
cd scripts
npm run generate-podcast-scripts
```

**Output:** Markdown scripts in `scripts/output/podcasts/`
- Version-controllable
- Manually editable
- Contains frontmatter with metadata

### Stage 2: Generate Audio from Scripts
```bash
cd scripts
npm run generate-podcast-audio
```

**Output:** WAV files in `website/static/audio/`
- Reads saved scripts
- Multi-speaker synthesis
- Updates audio manifest

### Legacy Monolithic Script
```bash
cd scripts
npm run generate-podcast-legacy
```

Runs the original single-stage script (generates dialog inline without saving)

## Output Structure

### Script Files
**Location:** `scripts/output/podcasts/`

**Structure:**
```
output/podcasts/
├── manifest.json
├── intro.md
├── fundamentals/
│   ├── lesson-1-how-llms-work.md
│   └── lesson-2-how-agents-work.md
└── methodology/
    └── lesson-3-high-level-methodology.md
```

**Script Format:**
```markdown
---
source: fundamentals/lesson-1-how-llms-work.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-01T12:34:56.789Z
model: claude-haiku-4.5
tokenCount: 5234
---

Alex: Let's dive into AI coding agents...

Sam: I've been using them for a few months now...
```

### Audio Files
**Location:** `website/static/audio/`

**Structure:** Mirrors script directory structure

**Manifest:** `website/static/audio/manifest.json`
```json
{
  "fundamentals/lesson-1-how-llms-work.md": {
    "audioUrl": "/audio/fundamentals/lesson-1-how-llms-work.wav",
    "size": 1234567,
    "format": "audio/wav",
    "tokenCount": 5234,
    "generatedAt": "2025-11-01T12:34:56.789Z",
    "scriptSource": "fundamentals/lesson-1-how-llms-work.md"
  }
}
```

## Processing Pipeline

### Script Generation (generate-podcast-script.js)
1. **Content Discovery**: Scans `website/docs/` for .md/.mdx files
2. **Content Parsing**: Strips frontmatter, JSX, code blocks
3. **Prompt Engineering**: Builds optimized prompt for Haiku 4.5
4. **Dialog Generation**: Calls Claude Code CLI in headless mode
5. **Script Output**: Saves markdown with frontmatter to `output/podcasts/`
6. **Manifest Update**: Updates script manifest

### Audio Synthesis (generate-podcast-audio.js)
1. **Script Discovery**: Scans `output/podcasts/` for markdown files
2. **Script Parsing**: Extracts frontmatter and dialog
3. **Token Validation**: Ensures dialog fits TTS limits
4. **Audio Synthesis**: Calls Gemini 2.5 Flash TTS with multi-speaker config
5. **WAV Creation**: Adds proper headers to PCM data
6. **Audio Output**: Saves to `website/static/audio/`
7. **Manifest Update**: Updates audio manifest

## Configuration

### Models
- **Dialog Generation**: Claude Haiku 4.5 (via Claude Code CLI)
- **TTS**: `gemini-2.5-flash-preview-tts` (audio synthesis)

### Speakers
- **Alex**: "Kore" voice (firm, professional instructor)
- **Sam**: "Charon" voice (neutral, professional engineer)

### Processing
- **Script concurrency**: 3 files at a time (Claude CLI calls)
- **Audio concurrency**: 3 files at a time (API rate limits)
- **Token limits**: 6,000-7,500 tokens per dialog (TTS API constraint)

## Cost Estimation

### Script Generation (Claude Haiku 4.5)
- **Input**: ~$0.25 per 1M tokens
- **Output**: ~$1.25 per 1M tokens
- **Estimated per lesson**: ~$0.01-0.05 (depends on content length)

### Audio Synthesis (Gemini 2.5 Flash TTS)
- **Audio output**: $10.00 per 1M tokens
- **Estimated per lesson**: ~$0.05-0.10 (6k-7k tokens avg)

### Full Course (12 lessons)
- **Script generation**: ~$0.50-1.00 total
- **Audio synthesis**: ~$0.60-1.20 total
- **Combined**: ~$1.10-2.20 total

**Benefits of split pipeline:**
- Regenerate audio without re-prompting LLM (saves script gen costs)
- Edit scripts manually before audio synthesis (reduces audio regeneration)

## Utility Scripts

### fix-wav-files.js
Repairs corrupted WAV files (adds missing headers to raw PCM data):

```bash
cd scripts
node fix-wav-files.js
```

This creates `.bak` backups and adds proper RIFF/WAV headers to headerless PCM files.

## Troubleshooting

### "No API key found" (Gemini)
Set one of the environment variables: `GOOGLE_API_KEY`, `GEMINI_API_KEY`, or `GCP_API_KEY`

### "Failed to spawn Claude CLI"
1. Ensure Claude Code CLI is installed: `npm install -g @anthropic-ai/claude-code`
2. Verify it's in PATH: `which claude` (should return a path)
3. Authenticate: Run `claude` and follow prompts
4. Check permissions: Script uses `--dangerously-skip-permissions` flag

### "Module not found"
Run `npm install` in the scripts directory

### "No script files found"
Run `npm run generate-podcast-scripts` first before generating audio

### Dialog exceeds token limit
The script was generated with too much content. Regenerate with stricter constraints or manually edit the script file to reduce length.

### Corrupted/unplayable WAV files
The audio generation script automatically adds proper WAV headers. If you have old files from the legacy script:
```bash
node fix-wav-files.js
```

### Audio quality issues
The Gemini 2.5 Flash TTS model is in preview and may have some background noise in long generations (known issue as of October 2025)

### Rate limit errors
- Script generation: Reduce concurrency in `generate-podcast-script.js` (currently 3)
- Audio generation: Reduce concurrency in `generate-podcast-audio.js` (currently 3)

## Development

### Test with single file

**Script generation:**
```javascript
// In generate-podcast-script.js main(), after finding files:
const files = findMarkdownFiles(DOCS_DIR).slice(0, 1); // Test first file only
```

**Audio generation:**
```javascript
// In generate-podcast-audio.js main(), after finding files:
const files = findScriptFiles(SCRIPT_INPUT_DIR).slice(0, 1); // Test first file only
```

### Manual testing workflow
```bash
# 1. Generate single script
cd scripts
# Edit generate-podcast-script.js to slice(0, 1)
npm run generate-podcast-scripts

# 2. Review output
cat output/podcasts/intro.md

# 3. Generate audio from that script
# Edit generate-podcast-audio.js to slice(0, 1)
npm run generate-podcast-audio

# 4. Test audio playback
open ../website/static/audio/intro.wav
```

### Automatic exclusions
- Scripts automatically skip `CLAUDE.md` files (project instructions)
- Requires `.md` or `.mdx` extension

### Version control considerations
**Scripts (`output/podcasts/`)**: Consider version-controlling these for:
- Manual editing capability
- Tracking prompt quality improvements
- Rollback if regeneration produces worse results

**Audio files (`website/static/audio/`)**: Typically excluded from git due to size:
```gitignore
# Add to .gitignore if needed
website/static/audio/*.wav
```

## Related Documentation

- [Gemini API - Speech Generation](https://ai.google.dev/gemini-api/docs/speech-generation)
- [Gemini API - Models](https://ai.google.dev/gemini-api/docs/models)
- [Gemini API - Pricing](https://ai.google.dev/gemini-api/docs/pricing)
