#!/usr/bin/env node

/**
 * OG Image Generator
 *
 * This script converts the SVG to PNG for social media sharing.
 *
 * Usage:
 *   npm install sharp
 *   node scripts/generate-og-image.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateOGImage() {
  try {
    // Try to import sharp
    const sharp = await import('sharp').catch(() => null);

    if (!sharp) {
      console.log('⚠️  Sharp is not installed.');
      console.log('');
      console.log('To generate the PNG automatically:');
      console.log('  1. Run: npm install -D sharp');
      console.log('  2. Run: node scripts/generate-og-image.js');
      console.log('');
      console.log('Alternative methods:');
      console.log(
        '  • Open scripts/og-image-generator.html in your browser and use the download button'
      );
      console.log('  • Use an online converter: https://cloudconvert.com/svg-to-png');
      console.log('  • Open public/og-image.svg in a browser and take a 1200x630 screenshot');
      return;
    }

    const svgPath = join(__dirname, '..', 'public', 'og-image.svg');
    const pngPath = join(__dirname, '..', 'public', 'og-image.png');

    const svgBuffer = readFileSync(svgPath);

    await sharp.default(svgBuffer).resize(1200, 630).png().toFile(pngPath);

    console.log('✅ Successfully generated og-image.png!');
    console.log(`   Location: ${pngPath}`);
  } catch (error) {
    console.error('❌ Error generating image:', error.message);
    console.log('');
    console.log('Please use one of the alternative methods:');
    console.log('  • Open scripts/og-image-generator.html in your browser');
    console.log('  • Use https://cloudconvert.com/svg-to-png');
  }
}

generateOGImage();
