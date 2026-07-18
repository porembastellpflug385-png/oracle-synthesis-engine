import { readFile } from 'node:fs/promises';

const [html, html2canvas, jspdf] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../vendor/html2canvas-1.4.1.min.js', import.meta.url), 'utf8'),
  readFile(new URL('../vendor/jspdf-2.5.1.umd.min.js', import.meta.url), 'utf8'),
]);

const required = [
  'id="oracle-synthesis-engine"',
  'id="ose-chart"',
  'id="ose-redraw"',
  'id="ose-read"',
  'id="ose-birth-city"',
  'id="ose-horizon"',
  'id="ose-cast-guidance"',
  'id="ose-cast-trace"',
  'id="ose-report"',
  'id="ose-direct-answer"',
  'id="ose-answer-direct"',
  'id="ose-download-pdf"',
  'id="ose-report-audit"',
  'id="ose-consensus-table"',
  'id="ose-report-stage-1"',
  'id="ose-report-disclaimer"',
  '象征性合参 · 用于自我反思，不替代专业决策'
];

const missing = required.filter((token) => !html.includes(token));
if (missing.length) {
  throw new Error(`Missing required markup: ${missing.join(', ')}`);
}

const horizonValues = ['hour', 'day', 'week', 'month', 'quarter', 'half', 'year'];
const missingHorizons = horizonValues.filter(
  (value) => !html.includes(`name="ose-horizon" value="${value}"`),
);
if (missingHorizons.length) {
  throw new Error(`Missing prediction horizons: ${missingHorizons.join(', ')}`);
}

const strictSystems = ['tarot', 'iching', 'runes', 'bazi', 'luoshu', 'zodiac', 'chinese_zodiac', 'numerology', 'planetary'];
const missingSystems = strictSystems.filter(
  (value) => !html.includes(`id: '${value}'`),
);
if (missingSystems.length) {
  throw new Error(`Missing strict systems: ${missingSystems.join(', ')}`);
}

if (/id: '(?:ziwei|tuibei|fengshui)'/.test(html)) {
  throw new Error('Uncomputed placeholder systems must not return.');
}

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .filter((source) => source.trim());

for (const source of scripts) {
  new Function(source);
}

if (/window\.openai|sendFollowUpMessage/.test(html)) {
  throw new Error('Host-only Codex APIs must not appear in the standalone build.');
}

if (/Math\.floor\(rng\(\)\*64\)|stars\[Math\.floor/.test(html)) {
  throw new Error('Seeded placeholder divination must not return in strict mode.');
}

if (!html.includes("type:'debt_recovery'") || !html.includes('function debtTimedPlan')) {
  throw new Error('Question-specific debt recovery analysis must not disappear.');
}

if (html2canvas.length < 150_000 || jspdf.length < 300_000) {
  throw new Error('Bundled PDF libraries are missing or incomplete.');
}

if (!html.includes('function downloadDeepReportPdf') || !html.includes('pdf.addImage')) {
  throw new Error('Visual PDF export must not disappear.');
}

console.log(`Validated ${scripts.length} inline scripts, ${required.length} UI contracts, ${horizonValues.length} horizons, and ${strictSystems.length} strict systems.`);
