/**
 * Auto-generate service worker with timestamp-based version
 * This ensures the PWA cache updates on every deployment without manual version bumping
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate version from timestamp (e.g., "2024.1109.1430")
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hour = String(now.getUTCHours()).padStart(2, '0');
const minute = String(now.getUTCMinutes()).padStart(2, '0');

const version = `${year}.${month}${day}.${hour}${minute}`;

// Generate one service worker per app from its template.
const apps = ['streak', 'budget'];
for (const app of apps) {
  const templatePath = path.join(__dirname, `../public/${app}-sw-template.js`);
  const swTemplate = fs.readFileSync(templatePath, 'utf8');
  const swContent = swTemplate.replace('__CACHE_VERSION__', version);
  const outputPath = path.join(__dirname, `../public/${app}-sw.js`);
  fs.writeFileSync(outputPath, swContent);
  console.log(`✅ Generated ${app}-sw.js with version: ${version}`);
}
