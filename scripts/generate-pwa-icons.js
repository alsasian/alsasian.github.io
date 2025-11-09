import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Icon sizes needed for PWA
const sizes = [
  { size: 48, name: 'icon-48x48.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' }, // Apple specific
];

const svgPath = join(__dirname, '../public/favicon.svg');
const outputDir = join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
mkdirSync(outputDir, { recursive: true });

const svgBuffer = readFileSync(svgPath);

console.log('Generating PWA icons...\n');

// Generate all icon sizes
Promise.all(
  sizes.map(async ({ size, name }) => {
    const outputPath = join(outputDir, name);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${name} (${size}x${size})`);
  })
)
  .then(() => {
    console.log('\n✓ All PWA icons generated successfully!');
  })
  .catch((err) => {
    console.error('Error generating icons:', err);
    process.exit(1);
  });
