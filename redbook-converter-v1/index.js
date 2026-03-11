const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const marked = require('marked');

const INPUT_FILE = process.argv[2];
console.log(`Processing file: ${INPUT_FILE}`);

if (!INPUT_FILE) {
  console.error('Please provide a markdown file path.');
  process.exit(1);
}

const markdownContent = fs.readFileSync(INPUT_FILE, 'utf8');
const htmlContent = marked.parse(markdownContent);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap');

body {
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  font-family: 'Noto Sans SC', sans-serif;
  color: #333;
  font-size: 32px;
  line-height: 1.6;
}

h1 {
  font-size: 80px; /* Increased from 64px */
  font-weight: 800; /* Extra bold */
  margin-bottom: 40px;
  color: #000;
  border-bottom: 6px solid #ff2e4d; /* Thicker accent */
  padding-bottom: 24px;
  line-height: 1.2;
}

h2 {
  font-size: 48px;
  font-weight: 700;
  margin-top: 40px;
  margin-bottom: 20px;
  color: #333;
  border-left: 10px solid #ff2e4d;
  padding-left: 20px;
}

h3 {
  font-size: 40px;
  font-weight: 700;
  margin-top: 30px;
  margin-bottom: 16px;
}

p, li {
  margin-bottom: 16px;
  text-align: justify;
}

ul, ol {
  padding-left: 40px;
  margin-bottom: 24px;
}

li {
  padding-left: 10px;
}

code {
  background-color: #f4f4f4;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

pre {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  overflow-x: hidden;
  white-space: pre-wrap;
  margin-bottom: 40px;
}
pre code {
  background: none;
  padding: 0;
}

blockquote {
  margin: 40px 0;
  padding: 20px 40px;
  background-color: #fff0f2;
  border-left: 8px solid #ff2e4d;
  font-style: italic;
  color: #555;
}

img {
  max-width: 100%;
  border-radius: 12px;
  margin: 20px 0;
}

.page-container {
    width: 1080px;
    height: 1440px;
    padding: 60px;
    box-sizing: border-box;
    background-color: white;
    overflow: hidden;
    position: relative;
    margin-bottom: 20px;
}
`;

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${CSS}</style>
</head>
<body>
  ${htmlContent}
</body>
</html>
`;

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1080, height: 1440, deviceScaleFactor: 2 });

  await page.setContent(HTML_TEMPLATE);

  const PAGE_HEIGHT = 1440;
  
  await page.evaluate((pageHeight) => {
      function createPage() {
          const div = document.createElement('div');
          div.className = 'page-container';
          return div;
      }

      const elements = Array.from(document.body.children);
      document.body.innerHTML = '';
      
      let currentPage = createPage();
      document.body.appendChild(currentPage);

      function appendOrSplit(el, container) {
          container.appendChild(el);
          
          if (container.scrollHeight <= container.clientHeight + 1) {
              return; 
          }
          
          container.removeChild(el);
          
          const isList = (el.tagName === 'UL' || el.tagName === 'OL');
          
          if (!isList || el.children.length === 0) {
              if (container.children.length === 0) {
                  container.appendChild(el);
                  return;
              }
              currentPage = createPage();
              document.body.appendChild(currentPage);
              appendOrSplit(el, currentPage);
              return;
          }
          
          const children = Array.from(el.children);
          const listPart1 = el.cloneNode(false);
          container.appendChild(listPart1);
          
          let splitIndex = -1;
          
          for (let i = 0; i < children.length; i++) {
              listPart1.appendChild(children[i]);
              if (container.scrollHeight > container.clientHeight + 1) {
                  listPart1.removeChild(children[i]);
                  splitIndex = i;
                  break;
              }
          }
          
          if (splitIndex === -1) {
              return;
          }
          
          if (splitIndex === 0) {
              container.removeChild(listPart1);
              if (container.children.length === 0) {
                 container.appendChild(el);
                 return;
              }
              currentPage = createPage();
              document.body.appendChild(currentPage);
              appendOrSplit(el, currentPage);
              return;
          }
          
          const remaining = children.slice(splitIndex);
          currentPage = createPage();
          document.body.appendChild(currentPage);
          
          const listPart2 = el.cloneNode(false);
          if (el.tagName === 'OL') {
               const start = parseInt(el.getAttribute('start') || '1');
               listPart2.setAttribute('start', start + splitIndex);
          }
          
          remaining.forEach(c => listPart2.appendChild(c));
          
          appendOrSplit(listPart2, currentPage);
      }

      elements.forEach((el, index) => {
          if (/^H[1-6]$/.test(el.tagName)) {
              const nextEl = elements[index + 1];
              if (nextEl) {
                  currentPage.appendChild(el);
                  currentPage.appendChild(nextEl);
                  
                  const overflow = currentPage.scrollHeight > currentPage.clientHeight + 1;
                  
                  currentPage.removeChild(nextEl);
                  currentPage.removeChild(el);
                  
                  if (overflow && currentPage.children.length > 0) {
                      currentPage = createPage();
                      document.body.appendChild(currentPage);
                  }
              }
          }
          
          appendOrSplit(el, currentPage);
      });
      
  }, PAGE_HEIGHT);

  const pageContainers = await page.$$('.page-container');
  console.log(`Generated ${pageContainers.length} pages.`);

  for (let i = 0; i < pageContainers.length; i++) {
      const container = pageContainers[i];
      const fileName = `xiaohongshu-${String(i + 1).padStart(2, '0')}.png`;
      await container.screenshot({ path: fileName });
      console.log(`Saved ${fileName}`);
  }

  await browser.close();
})();
