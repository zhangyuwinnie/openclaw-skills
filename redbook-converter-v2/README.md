# Redbook Converter v2 (Classic Template Baseline)

Template-driven renderer for Redbook slides.

## What it does

- Renders a prepared HTML file into slide images
- Uses `.slide` blocks as screenshot units
- Keeps visual control in HTML/CSS (best for style expansion)

## Built-in Template

Classic baseline template is tracked in repo:

- `assets/template.html`

Template contract:
- Canvas: `1080 x 1440`
- One page per `.slide`
- Footer/title hierarchy handled in HTML structure

## Usage

```bash
npm install
node scripts/render.js <path-to-html-file>
```

Example:

```bash
node scripts/render.js ./assets/template.html
```

## Output

Generated next to your input HTML:

- `slide_1.png`
- `slide_2.png`
- ...

## Notes

- v2 currently focuses on `html -> png` rendering.
- Recommended workflow for advanced styles (e.g. `minimal-card`):
  1) LLM generates `slides.html` from `input.md` following template contract
  2) v2 renders HTML to PNG
