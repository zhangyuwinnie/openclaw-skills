---
name: redbook-converter
description: Convert text or Markdown content into beautiful, Xiaohongshu-style (Redbook) image slides (3:4 aspect ratio). Use when a user wants to turn a document, note, or idea into a social media carousel.
---

# Redbook Converter (Xiaohongshu Slides)

This skill converts content into image slides suitable for Xiaohongshu (Little Red Book).

## Usage

1.  **Prepare Content**:
    -   Summarize the content into 3-6 key points/slides.
    -   Draft the text for each slide (Cover, Points, Summary).
    -   **CRITICAL**: You must generate a single HTML file containing all slides. Use the template below as a guide, but fill it with the specific content.

2.  **Generate HTML**:
    -   Read `assets/template.html` for the structure and style.
    -   Create a new HTML file (e.g., `slides.html`) with the user's content inserted into the template.
    -   Ensure the CSS sets the viewport to 1080x1440 and handles page breaks or distinct slide divs (class="slide").

3.  **Render Images**:
    -   Run the bundled script `scripts/render.js`.
    -   Usage: `node scripts/render.js <path-to-html-file>`
    -   The script will generate `slide_1.png`, `slide_2.png`, etc., in the same directory as the HTML file.

4.  **Deliver**:
    -   Send the generated PNG images to the user.
    -   Clean up the temporary HTML and PNG files afterwards (unless asked to keep them).

## Dependencies

-   Node.js
-   Puppeteer (ensure it's installed in the environment or the skill's node_modules)

## Template Structure (Reference)

The HTML should use a container with `width: 1080px; height: 1440px;` for each slide. The script selects elements with class `.slide` to take screenshots.

```html
<div class="slide" id="slide1">
  <!-- Content -->
</div>
<div class="slide" id="slide2">
  <!-- Content -->
</div>
```
