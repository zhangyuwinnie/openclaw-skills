# Rednote Converter

Converts Markdown files into 1080x1440 images optimized for Xiaohongshu (Rednote).

## Usage
Run the script from the workspace root:

```bash
bash skills/rednote/run.sh <input.md>
```

## Features
- **3:4 Aspect Ratio**: 1080x1440 resolution.
- **Smart Pagination**: Automatically splits content into multiple images, keeping headers with their content.
- **Mobile Optimized**: Large fonts (32px), clear hierarchy.
- **Styling**: White background, dark gray text, Rednote red accents.

## Dependencies
- Node.js (v14+)
- `puppeteer`
- `marked`

Install dependencies in workspace root:
```bash
npm install puppeteer marked
```
