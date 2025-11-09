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

// Read template
const templatePath = path.join(__dirname, '../public/streak-sw-template.js');
const swTemplate = fs.readFileSync(templatePath, 'utf8');

// Replace version placeholder
const swContent = swTemplate.replace('__CACHE_VERSION__', version);

// Write final service worker
const outputPath = path.join(__dirname, '../public/streak-sw.js');
fs.writeFileSync(outputPath, swContent);

console.log(`✅ Generated service worker with version: ${version}`);
