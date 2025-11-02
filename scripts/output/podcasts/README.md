# Podcast Scripts Output Directory

This directory contains AI-generated podcast dialog scripts in markdown format.

## Structure

```
podcasts/
├── manifest.json                    # Maps source docs to script files
├── intro.md                         # Root-level docs
└── [module-name]/                   # Module subdirectories
    └── [lesson-name].md             # Individual lesson scripts
```

## Script Format

Each script is a markdown file with YAML frontmatter:

```markdown
---
source: understanding-the-tools/lesson-1-intro.md
speakers:
  - name: Alex
    role: Instructor
    voice: Kore
  - name: Sam
    role: Senior Engineer
    voice: Charon
generatedAt: 2025-11-01T...
model: claude-haiku-4.5
tokenCount: 5234
---

Alex: [dialog content]

Sam: [dialog content]

[continues...]
```

## Usage

**Generate scripts:**
```bash
cd scripts
npm run generate-podcast-scripts
```

**Generate audio from scripts:**
```bash
cd scripts
npm run generate-podcast-audio
```

**Generate both (scripts + audio):**
```bash
cd scripts
npm run generate-podcast
```

## Notes

- Scripts are generated using Claude Haiku 4.5 via Claude Code CLI
- Dialog is optimized for senior software engineers (professional, engaging, educational)
- Scripts are version-controlled and can be manually edited before audio synthesis
- Audio generation reads from these files rather than regenerating dialog
