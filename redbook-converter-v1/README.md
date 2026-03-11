# Redbook Converter v1

Markdown-first converter for Xiaohongshu/Redbook images.

## What it does

- Parses Markdown (`h1/h2/h3`, paragraphs, lists, quote, code)
- Auto-paginates into 3:4 slides
- Renders to 1080x1440 PNG images

## Usage

```bash
npm install
node index.js <input.md>
```

Example:

```bash
node index.js /path/to/tdd_xiaohongshu.md
```

## Output

Generated in current working directory:

- `xiaohongshu-01.png`
- `xiaohongshu-02.png`
- ...

## Notes

- This is the fast, automatic pipeline (`md -> png`).
- For template/styled rendering (`html -> png`), use `../redbook-converter-v2`.
