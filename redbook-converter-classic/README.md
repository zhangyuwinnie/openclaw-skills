# Redbook Converter Classic

This is the classic Redbook style:
- Big red headline
- Supporting body copy
- Hashtags line
- Footer with author + page number

## Usage
1. Prepare slides HTML (with `.slide` blocks, 1080x1440 each)
2. Render with:

```bash
node scripts/render.js <path-to-html-file>
```

Outputs: `slide_1.png`, `slide_2.png`, ...
