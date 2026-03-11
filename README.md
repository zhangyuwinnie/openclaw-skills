# OpenClaw Skills

OpenClaw skills repository (versioned).

## Included Skills

### 1) `redbook-converter-v1`
- **Type:** Markdown-first converter
- **Flow:** `input.md -> PNG`
- **Best for:** Quick auto-pagination output from raw Markdown
- **Output:** `xiaohongshu-01.png`, `xiaohongshu-02.png`, ...

### 2) `redbook-converter-v2`
- **Type:** Template-driven renderer (style baselines: classic + minimal-card)
- **Flow:** `slides.html -> PNG`
- **Best for:** Design-controlled layouts and style extension
- **Templates:**
  - `redbook-converter-v2/assets/template.html` (classic)
  - `redbook-converter-v2/assets/template.minimal-card.html` (minimal-card)
- **Output:** `slide_1.png`, `slide_2.png`, ...

## Versioning Notes

- `redbook-converter-v1` is the renamed lineage of the old `xiaohongshu-converter`.
- `redbook-converter-v2` is the renamed lineage of `redbook-converter-classic`.
- `rednote-skill-v2` has been removed (duplicate path consolidated).

## Usage

Please read each skill folder's `README.md` for exact commands and examples.

## License

MIT
