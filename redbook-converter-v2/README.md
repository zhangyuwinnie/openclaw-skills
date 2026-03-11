# Redbook Converter v2 (Classic Template Baseline)

Template-driven renderer for Redbook slides.

## What it does

- Renders a prepared HTML file into slide images
- Uses `.slide` blocks as screenshot units
- Keeps visual control in HTML/CSS (best for style expansion)

## Built-in Template

Templates tracked in repo:

- `assets/template.html` (classic baseline)
- `assets/template.minimal-card.html` (minimal-card baseline)

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

## Color Picking Utility

A helper script is included for extracting palette colors from reference images:

- `scripts/pick_colors.py`

Usage examples:

```bash
# ROI sampling (x,y,w,h)
python3 scripts/pick_colors.py <image> --roi 640,520,60,640 --name outer_bg

# Point sampling with radius
python3 scripts/pick_colors.py <image> --point 686,560 --radius 6 --name near_bg
```

Optional filters:

- `--min-luma <0-255>`
- `--max-luma <0-255>`

## Notes

- v2 focuses on `html -> png` rendering.
- Recommended workflow for advanced styles (e.g. `minimal-card`):
  1) LLM generates `slides.html` from `input.md` following template contract and chosen template style
  2) v2 renders HTML to PNG
