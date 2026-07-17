import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

const required = [
  'id="oracle-synthesis-engine"',
  'id="ose-chart"',
  'id="ose-redraw"',
  'id="ose-read"',
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

const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map((match) => match[1])
  .filter((source) => source.trim());

for (const source of scripts) {
  new Function(source);
}

if (/window\.openai|sendFollowUpMessage/.test(html)) {
  throw new Error('Host-only Codex APIs must not appear in the standalone build.');
}

console.log(`Validated ${scripts.length} inline scripts and ${required.length} required UI contracts.`);
