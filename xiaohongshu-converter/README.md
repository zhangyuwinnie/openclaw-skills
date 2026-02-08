# Xiaohongshu Converter (Rednote Converter)

A Node.js tool to convert Markdown files into 1080x1440 images optimized for Xiaohongshu (Rednote). It automatically paginates content and applies a beautiful styling.

## Features
- **Markdown Support:** Converts H1, H2, H3, paragraphs, lists, blockquotes, and code blocks.
- **Auto-Pagination:** Splits long content into multiple 3:4 aspect ratio images.
- **Stylish Layout:** Uses Noto Sans SC font, custom margins, and elegant spacing.
- **Puppeteer Rendering:** Ensures high-quality screenshots.

## Usage

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Prepare your Markdown file:** (e.g., `input.md`)

3.  **Run the Converter:**
    ```bash
    node index.js input.md
    ```

4.  **Output:**
    The script will generate `xiaohongshu-01.png`, `xiaohongshu-02.png`, etc., in the current directory.

## Requirements
- Node.js
- Puppeteer (`npm install puppeteer`)
- Marked (`npm install marked`)
