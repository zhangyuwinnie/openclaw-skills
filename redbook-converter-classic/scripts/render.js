import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error('Usage: node render.js <path-to-html-file>');
  process.exit(1);
}

const htmlFile = args[0];
const absHtmlPath = path.resolve(htmlFile);
const outputDir = path.dirname(absHtmlPath);

if (!fs.existsSync(absHtmlPath)) {
  console.error(`Error: File not found: ${absHtmlPath}`);
  process.exit(1);
}

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    const fileUrl = 'file://' + absHtmlPath;
    console.log(`Loading: ${fileUrl}`);
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Set viewport to slide size (Xiaohongshu optimal: 3:4 ratio, e.g., 1080x1440)
    await page.setViewport({ width: 1080, height: 1440 });

    const slides = await page.$$('.slide');
    console.log(`Found ${slides.length} slides.`);

    if (slides.length === 0) {
      console.warn('Warning: No elements with class ".slide" found.');
    }

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const filename = path.join(outputDir, `slide_${i + 1}.png`);
      await slide.screenshot({ path: filename });
      console.log(`Saved ${filename}`);
    }

    await browser.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
