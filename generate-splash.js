const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Android splash screen size (most common resolution)
const SPLASH_WIDTH = 1080;
const SPLASH_HEIGHT = 1920;

// App colors
const colors = {
  primary: '#1B4965',
  primaryLight: '#2C6B8F',
  secondary: '#62B6CB',
  accent: '#C1986A',
  accentLight: '#D4B38D',
};

async function generateAndroidSplash() {
  console.log('🎨 Generating Android Splash Screen (1080x1920)...');
  
  const svg = `
    <svg width="${SPLASH_WIDTH}" height="${SPLASH_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="splashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.primaryLight};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:1" />
        </linearGradient>
        <pattern id="splashPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <circle cx="40" cy="40" r="2" fill="${colors.accent}" opacity="0.12"/>
          <circle cx="0" cy="0" r="1.5" fill="${colors.accent}" opacity="0.08"/>
          <circle cx="80" cy="0" r="1.5" fill="${colors.accent}" opacity="0.08"/>
          <circle cx="0" cy="80" r="1.5" fill="${colors.accent}" opacity="0.08"/>
          <circle cx="80" cy="80" r="1.5" fill="${colors.accent}" opacity="0.08"/>
        </pattern>
        <radialGradient id="glow" cx="50%" cy="40%">
          <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
        </radialGradient>
      </defs>
      
      <!-- Background gradient -->
      <rect width="${SPLASH_WIDTH}" height="${SPLASH_HEIGHT}" fill="url(#splashGrad)"/>
      <rect width="${SPLASH_WIDTH}" height="${SPLASH_HEIGHT}" fill="url(#splashPattern)"/>
      <ellipse cx="540" cy="800" rx="350" ry="250" fill="url(#glow)"/>
      
      <!-- Decorative top corners -->
      <g opacity="0.15">
        <path d="M 0 0 L 100 0 L 100 12 L 12 12 L 12 100 L 0 100 Z" fill="${colors.accent}"/>
        <path d="M ${SPLASH_WIDTH} 0 L ${SPLASH_WIDTH - 100} 0 L ${SPLASH_WIDTH - 100} 12 L ${SPLASH_WIDTH - 12} 12 L ${SPLASH_WIDTH - 12} 100 L ${SPLASH_WIDTH} 100 Z" fill="${colors.accent}"/>
      </g>
      
      <!-- Main icon circle with glow -->
      <circle cx="540" cy="860" r="140" fill="${colors.primary}" opacity="0.3"/>
      <circle cx="540" cy="860" r="130" fill="#FFFFFF" opacity="0.98"/>
      <circle cx="540" cy="860" r="125" fill="url(#splashGrad)" opacity="0.1"/>
      
      <!-- Quran icon in circle -->
      <g transform="translate(540, 860)">
        <!-- Open book -->
        <path d="M -60 -45 Q -60 -58 -48 -58 L -7 -58 L -7 45 L -48 45 Q -60 45 -60 32 Z" 
              fill="#FFFFFF" stroke="${colors.accent}" stroke-width="2.5"/>
        <path d="M 7 -58 L 48 -58 Q 60 -58 60 -45 L 60 32 Q 60 45 48 45 L 7 45 Z" 
              fill="#FFFFFF" stroke="${colors.accent}" stroke-width="2.5"/>
        
        <!-- Center binding -->
        <rect x="-7" y="-58" width="14" height="103" fill="${colors.primary}"/>
        <rect x="-5" y="-58" width="10" height="103" fill="${colors.primaryLight}"/>
        
        <!-- Bookmark -->
        <path d="M -2.5 -58 L -2.5 30 L 0 22 L 2.5 30 L 2.5 -58 Z" fill="${colors.accent}"/>
        
        <!-- Arabic text on left page -->
        <text x="-33" y="-25" font-family="Arial" font-size="14" font-weight="bold"
              fill="${colors.primary}" text-anchor="middle">القرآن</text>
        <line x1="-48" y1="-8" x2="-18" y2="-8" stroke="${colors.accent}" stroke-width="1.2" opacity="0.5"/>
        <line x1="-48" y1="2" x2="-18" y2="2" stroke="${colors.accent}" stroke-width="0.8" opacity="0.4"/>
        
        <!-- Lines on right page -->
        <line x1="18" y1="-35" x2="48" y2="-35" stroke="${colors.accent}" stroke-width="1.2" opacity="0.5"/>
        <line x1="18" y1="-24" x2="48" y2="-24" stroke="${colors.accent}" stroke-width="0.8" opacity="0.4"/>
        <line x1="18" y1="-13" x2="48" y2="-13" stroke="${colors.accent}" stroke-width="0.8" opacity="0.4"/>
      </g>
      
      <!-- Arabic title "القرآن الكريم" -->
      <text x="540" y="1080" font-family="Arial" font-size="46" font-weight="bold"
            fill="${colors.accent}" text-anchor="middle">القرآن الكريم</text>
      
      <!-- English title -->
      <text x="540" y="1160" font-family="Arial" font-size="58" font-weight="bold"
            fill="#FFFFFF" text-anchor="middle" letter-spacing="3">AL-QURAN</text>
      
      <!-- Subtitle -->
      <text x="540" y="1220" font-family="Arial" font-size="36" font-weight="500"
            fill="${colors.accentLight}" text-anchor="middle">Read and Listen</text>
      
      <!-- Bottom decorative element -->
      <g transform="translate(540, 1780)" opacity="0.2">
        <circle cx="0" cy="0" r="5" fill="${colors.accent}"/>
        <circle cx="-35" cy="0" r="3.5" fill="${colors.accent}"/>
        <circle cx="35" cy="0" r="3.5" fill="${colors.accent}"/>
        <line x1="-30" y1="0" x2="-8" y2="0" stroke="${colors.accent}" stroke-width="1.5"/>
        <line x1="8" y1="0" x2="30" y2="0" stroke="${colors.accent}" stroke-width="1.5"/>
      </g>
    </svg>
  `;

  const outputPath = path.join(__dirname, 'assets', 'images', 'splash.png');
  
  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Splash screen created: ${outputPath}`);
    console.log(`📏 Size: ${SPLASH_WIDTH}x${SPLASH_HEIGHT}px`);
  } catch (error) {
    console.error('❌ Failed to generate splash screen:', error.message);
  }
}

generateAndroidSplash();
