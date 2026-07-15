/**
 * Generate the Budget PWA icons from an inline SVG (marigold "shape of the
 * year" bars on a dark tile). Run once; the PNGs are committed like the
 * streak icons. Regenerate with: node scripts/generate-budget-icons.js
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/icons');

// 512x512 canvas. Three ascending bars; the tallest wears the marigold accent.
const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#16191c"/>
  <g>
    <rect x="121" y="260" width="70" height="120" rx="10" fill="#e9eceb"/>
    <rect x="221" y="190" width="70" height="190" rx="10" fill="#e9eceb"/>
    <rect x="321" y="130" width="70" height="250" rx="10" fill="#f2b63a"/>
    <rect x="121" y="396" width="270" height="7" rx="3.5" fill="#f2b63a"/>
  </g>
</svg>`;

const targets = [
  { name: 'budget-icon-192x192.png', size: 192 },
  { name: 'budget-icon-512x512.png', size: 512 },
  { name: 'budget-apple-touch-icon.png', size: 180 },
];

for (const { name, size } of targets) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(path.join(outDir, name));
  console.log(`✅ ${name}`);
}
