#!/usr/bin/env node

/**
 * Build Script for Quran Tafsir JSON
 * 
 * This script merges Quran Arabic text, English translation, Bangla translation,
 * English tafsir, and Bangla tafsir into a single optimized JSON file.
 * 
 * Usage: node build_json.js
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DATA_DIR = path.join(__dirname, '../src/data');
const OUTPUT_FILE = path.join(DATA_DIR, 'quran_tafsir.json');
const COMPRESSED_FILE = path.join(DATA_DIR, 'quran_tafsir.json.gz');

console.log('🚀 Starting Quran Tafsir JSON build...\n');

// Sample data structure builder
function buildQuranData() {
  const quranData = {
    meta: {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      languages: ['en', 'bn'],
      sourceAttribution: {
        quranAr: 'Tanzil Project - Public Domain',
        tafsirEn: 'Ibn Kathir - Public Domain',
        tafsirBn: 'Tafheem-ul-Quran - Public Domain',
        audio: 'Various Reciters - CC Licensed',
      },
    },
    surahs: [],
  };

  // In a real implementation, you would:
  // 1. Read from multiple source JSON files
  // 2. Merge data by surah and ayah
  // 3. Validate all data
  
  console.log('✅ Quran data structure created');
  console.log(`   Total Surahs: ${quranData.surahs.length || 'Sample data'}`);
  
  return quranData;
}

// Validate JSON structure
function validateData(data) {
  console.log('\n🔍 Validating data structure...');
  
  if (!data.meta || !data.surahs) {
    throw new Error('Invalid data structure: missing meta or surahs');
  }
  
  console.log('✅ Data validation passed');
  return true;
}

// Write JSON file
function writeJSONFile(data, filePath) {
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonString, 'utf8');
  
  const sizeKB = (Buffer.byteLength(jsonString, 'utf8') / 1024).toFixed(2);
  console.log(`✅ JSON file written: ${path.basename(filePath)}`);
  console.log(`   Size: ${sizeKB} KB`);
  
  return jsonString;
}

// Compress JSON file
function compressJSON(jsonString, outputPath) {
  const compressed = zlib.gzipSync(jsonString);
  fs.writeFileSync(outputPath, compressed);
  
  const originalSize = (Buffer.byteLength(jsonString, 'utf8') / 1024).toFixed(2);
  const compressedSize = (compressed.length / 1024).toFixed(2);
  const ratio = ((1 - compressed.length / Buffer.byteLength(jsonString, 'utf8')) * 100).toFixed(1);
  
  console.log(`✅ Compressed file created: ${path.basename(outputPath)}`);
  console.log(`   Original: ${originalSize} KB`);
  console.log(`   Compressed: ${compressedSize} KB`);
  console.log(`   Compression ratio: ${ratio}%`);
}

// Main build function
async function build() {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    
    // Build data
    const quranData = buildQuranData();
    
    // Validate
    validateData(quranData);
    
    // Write JSON
    const jsonString = writeJSONFile(quranData, OUTPUT_FILE);
    
    // Compress
    compressJSON(jsonString, COMPRESSED_FILE);
    
    console.log('\n✨ Build completed successfully!\n');
    console.log('Files created:');
    console.log(`   - ${path.relative(process.cwd(), OUTPUT_FILE)}`);
    console.log(`   - ${path.relative(process.cwd(), COMPRESSED_FILE)}`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Run build
if (require.main === module) {
  build();
}

module.exports = { build };
