import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

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

console.log(`Validated ${scripts.length} inline scripts, ${required.length} UI contracts, and ${horizonValues.length} prediction horizons.`);
