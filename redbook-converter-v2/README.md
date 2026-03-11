# Redbook Converter v2 (Classic)

完整链路：`input.md -> slides.html -> slide_*.png`

风格（classic）：
- 大红标题
- 简洁正文
- hashtags
- 底部 footer（作者 + 页码）

## Usage

```bash
bash run.sh <input.md> [--style classic] [--author "@Dayu · R2"]
```

默认会在输入文件同目录生成：
- `<name>_slides.html`
- `slide_1.png`, `slide_2.png`, ...

## Split commands

```bash
node scripts/build-slides.js <input.md> [output.html] [--style classic] [--author "@Dayu · R2"]
node scripts/render.js <path-to-html-file>
```
