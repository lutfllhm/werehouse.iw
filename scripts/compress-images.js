/**
 * Image Compression Script
 * Compresses images in frontend/public/img folder to optimize web performance
 * 
 * Usage:
 * 1. Install sharp: npm install sharp --save-dev
 * 2. Run: node scripts/compress-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, '../frontend/public/img');
const OUTPUT_DIR = path.join(__dirname, '../frontend/public/img/optimized');

// Compression settings
const COMPRESSION_OPTIONS = {
  jpg: {
    quality: 80,
    progressive: true,
    mozjpeg: true
  },
  webp: {
    quality: 80,
    effort: 6
  },
  png: {
    quality: 80,
    compressionLevel: 9,
    progressive: true
  }
};

// Maximum dimensions for different image types
const MAX_DIMENSIONS = {
  background: { width: 1920, height: 1080 },
  logo: { width: 500, height: 500 },
  default: { width: 1200, height: 1200 }
};

/**
 * Create output directory if it doesn't exist
 */
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✓ Created output directory: ${OUTPUT_DIR}`);
  }
}

/**
 * Get max dimensions based on filename
 */
function getMaxDimensions(filename) {
  const lowerName = filename.toLowerCase();
  if (lowerName.includes('bg') || lowerName.includes('background')) {
    return MAX_DIMENSIONS.background;
  }
  if (lowerName.includes('logo') || lowerName.includes('lg')) {
    return MAX_DIMENSIONS.logo;
  }
  return MAX_DIMENSIONS.default;
}

/**
 * Compress a single image
 */
async function compressImage(filename) {
  const inputPath = path.join(IMAGE_DIR, filename);
  const ext = path.extname(filename).toLowerCase();
  const baseName = path.basename(filename, ext);
  
  // Skip if not an image
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return;
  }

  try {
    const stats = fs.statSync(inputPath);
    const originalSize = (stats.size / 1024).toFixed(2);
    
    console.log(`\nProcessing: ${filename} (${originalSize} KB)`);
    
    const maxDim = getMaxDimensions(filename);
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Resize if needed
    if (metadata.width > maxDim.width || metadata.height > maxDim.height) {
      image.resize(maxDim.width, maxDim.height, {
        fit: 'inside',
        withoutEnlargement: true
      });
      console.log(`  → Resizing to max ${maxDim.width}x${maxDim.height}`);
    }

    // Compress to original format
    const outputPath = path.join(OUTPUT_DIR, filename);
    if (ext === '.png') {
      await image
        .png(COMPRESSION_OPTIONS.png)
        .toFile(outputPath);
    } else {
      await image
        .jpeg(COMPRESSION_OPTIONS.jpg)
        .toFile(outputPath);
    }
    
    const compressedStats = fs.statSync(outputPath);
    const compressedSize = (compressedStats.size / 1024).toFixed(2);
    const savings = ((1 - compressedStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`  ✓ Compressed: ${compressedSize} KB (saved ${savings}%)`);

    // Also create WebP version
    const webpPath = path.join(OUTPUT_DIR, `${baseName}.webp`);
    await sharp(inputPath)
      .resize(maxDim.width, maxDim.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp(COMPRESSION_OPTIONS.webp)
      .toFile(webpPath);
    
    const webpStats = fs.statSync(webpPath);
    const webpSize = (webpStats.size / 1024).toFixed(2);
    const webpSavings = ((1 - webpStats.size / stats.size) * 100).toFixed(1);
    
    console.log(`  ✓ WebP version: ${webpSize} KB (saved ${webpSavings}%)`);
    
  } catch (error) {
    console.error(`  ✗ Error processing ${filename}:`, error.message);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Image Compression Script');
  console.log('='.repeat(60));
  
  // Check if sharp is installed
  try {
    require.resolve('sharp');
  } catch (e) {
    console.error('\n✗ Error: sharp is not installed');
    console.error('Please run: npm install sharp --save-dev\n');
    process.exit(1);
  }

  // Check if image directory exists
  if (!fs.existsSync(IMAGE_DIR)) {
    console.error(`\n✗ Error: Image directory not found: ${IMAGE_DIR}\n`);
    process.exit(1);
  }

  ensureOutputDir();

  // Get all files in image directory
  const files = fs.readdirSync(IMAGE_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });

  if (files.length === 0) {
    console.log('\n⚠ No images found to compress\n');
    return;
  }

  console.log(`\nFound ${files.length} image(s) to compress\n`);

  // Process each image
  for (const file of files) {
    await compressImage(file);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✓ Compression complete!');
  console.log(`\nOptimized images saved to: ${OUTPUT_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Review the optimized images');
  console.log('2. Replace original images with optimized versions if satisfied');
  console.log('3. Update image paths in your code to use .webp format for modern browsers');
  console.log('='.repeat(60) + '\n');
}

// Run the script
main().catch(console.error);
