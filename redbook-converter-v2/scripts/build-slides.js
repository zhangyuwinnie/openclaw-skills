import fs from 'fs';
import path from 'path';

function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function usage() {
  console.log('Usage: node scripts/build-slides.js <input.md> [output.html] [--author "@Dayu · R2"] [--style classic]');
}

const args = process.argv.slice(2);
if (args.length < 1) {
  usage();
  process.exit(1);
}

const inputMd = path.resolve(args[0]);
const outputHtml = args[1] && !args[1].startsWith('--')
  ? path.resolve(args[1])
  : path.join(path.dirname(inputMd), `${path.basename(inputMd, path.extname(inputMd))}_slides.html`);

let author = '@Dayu · R2';
let style = 'classic';
for (let i = 1; i < args.length; i++) {
  if (args[i] === '--author' && args[i + 1]) author = args[i + 1];
  if (args[i] === '--style' && args[i + 1]) style = args[i + 1];
}

if (style !== 'classic') {
  console.error(`Unsupported style: ${style}. Currently only 'classic' is implemented.`);
  process.exit(1);
}

if (!fs.existsSync(inputMd)) {
  console.error(`Input not found: ${inputMd}`);
  process.exit(1);
}

const raw = fs.readFileSync(inputMd, 'utf8');
const lines = raw.split(/\r?\n/);

let title = path.basename(inputMd, path.extname(inputMd));
for (const line of lines) {
  const t = line.trim();
  if (t.startsWith('# ')) {
    title = t.replace(/^#\s+/, '').trim();
    break;
  }
}

const plainLines = lines
  .map(l => l.trim())
  .filter(Boolean)
  .filter(l => !l.startsWith('#'))
  .filter(l => !l.startsWith('```'));

const bullets = [];
for (const line of plainLines) {
  if (/^[-*]\s+/.test(line)) bullets.push(line.replace(/^[-*]\s+/, '').trim());
  else if (/^\d+\.\s+/.test(line)) bullets.push(line.replace(/^\d+\.\s+/, '').trim());
}

const paragraphs = plainLines
  .filter(l => !/^[-*]\s+/.test(l) && !/^\d+\.\s+/.test(l))
  .filter(l => l.length <= 44);

const contentPool = [...bullets, ...paragraphs].filter(Boolean);

const hook = contentPool[0] || 'UI 小问题反复来回改？';
const subhook = contentPool[1] || '给 AI 一双“眼睛”，让它自己迭代到位。';

const hashtagsFound = Array.from(new Set((raw.match(/#[\p{L}\p{N}_-]+/gu) || []).slice(0, 6)));
const hashtags = hashtagsFound.length
  ? hashtagsFound.join(' ')
  : '#VibeCoding #TDD #AgenticEngineering #AI编程';

// Build pages: cover + N content + summary
const chunks = [];
const items = contentPool.slice(2);
const chunkSize = 5;
for (let i = 0; i < items.length; i += chunkSize) {
  chunks.push(items.slice(i, i + chunkSize));
}
if (chunks.length === 0) chunks.push(['先写测试（Red）', '最小实现（Green）', '重构优化（Refactor）']);

const totalPages = 1 + chunks.length + 1;

function footer(page) {
  return `<div class="footer"><span>${escapeHtml(author)}</span><span>${page}/${totalPages}</span></div>`;
}

const slides = [];

slides.push(`
<div class="slide cover">
  <h1>${escapeHtml(title)}</h1>
  <p class="hook">${escapeHtml(hook)}</p>
  <p class="subhook">${escapeHtml(subhook)}</p>
  <p class="hashtags">${escapeHtml(hashtags)}</p>
  ${footer(1)}
</div>`);

chunks.forEach((chunk, idx) => {
  const page = idx + 2;
  const lis = chunk.map(x => `<li>${escapeHtml(x)}</li>`).join('');
  slides.push(`
<div class="slide content">
  <h2>关键要点 ${idx + 1}</h2>
  <ul>${lis}</ul>
  ${footer(page)}
</div>`);
});

slides.push(`
<div class="slide summary">
  <h2>总结</h2>
  <p>把“写完再改”换成“先测再写”，交付更稳、迭代更快。</p>
  <p>你可以把这套流程交给 Agent 持续执行。</p>
  ${footer(totalPages)}
</div>`);

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=1080, height=1440, initial-scale=1.0" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700;900&display=swap');
  body {
    margin: 0;
    padding: 50px 0;
    background: #f5f5f7;
    font-family: 'Noto Sans SC', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
  }
  .slide {
    width: 1080px;
    height: 1440px;
    background: #fff;
    border-radius: 40px;
    box-shadow: 0 10px 30px rgba(0,0,0,.08);
    padding: 78px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }
  h1 {
    margin: 0;
    color: #ff2e4d;
    font-size: 92px;
    line-height: 1.15;
    font-weight: 900;
    letter-spacing: 0.5px;
  }
  .hook {
    margin: 54px 0 8px;
    font-size: 58px;
    color: #222;
    line-height: 1.35;
  }
  .subhook {
    margin: 0;
    font-size: 58px;
    color: #222;
    line-height: 1.35;
  }
  .hashtags {
    margin-top: 70px;
    color: #8d8f95;
    font-size: 52px;
  }
  h2 {
    margin: 0 0 28px;
    color: #ff2e4d;
    font-size: 78px;
    line-height: 1.2;
    font-weight: 900;
  }
  ul {
    margin: 0;
    padding-left: 45px;
  }
  li {
    margin-bottom: 24px;
    color: #222;
    font-size: 48px;
    line-height: 1.45;
  }
  .summary p {
    font-size: 52px;
    line-height: 1.5;
    color: #222;
    margin: 0 0 24px;
  }
  .footer {
    position: absolute;
    left: 78px;
    right: 78px;
    bottom: 46px;
    border-top: 3px solid #ececef;
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    color: #90939a;
    font-size: 42px;
  }
</style>
</head>
<body>
${slides.join('\n')}
</body>
</html>`;

fs.writeFileSync(outputHtml, html, 'utf8');
console.log(`Generated slides HTML: ${outputHtml}`);
