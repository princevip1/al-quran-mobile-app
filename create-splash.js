const sharp = require('sharp');

// For native Android splash, we need just a centered logo (not full screen design)
// Background color is handled by app.json
const SPLASH_SIZE = 288; // Standard Android splash icon size

const colors = {
  white: '#FFFFFF',
  accent: '#C1986A',
  primary: '#1B4965',
  primaryLight: '#2C6B8F',
};

const svg = `
  <svg width="${SPLASH_SIZE}" height="${SPLASH_SIZE}" xmlns="http://www.w3.org/2000/svg">
    <!-- Main icon circle -->
    <circle cx="144" cy="144" r="140" fill="${colors.white}" opacity="0.98"/>
    
    <!-- Quran book icon -->
    <g transform="translate(144, 144)">
      <!-- Open book -->
      <path d="M -65 -50 Q -65 -63 -53 -63 L -8 -63 L -8 50 L -53 50 Q -65 50 -65 37 Z" 
            fill="${colors.white}" stroke="${colors.accent}" stroke-width="3"/>
      <path d="M 8 -63 L 53 -63 Q 65 -63 65 -50 L 65 37 Q 65 50 53 50 L 8 50 Z" 
            fill="${colors.white}" stroke="${colors.accent}" stroke-width="3"/>
      
      <!-- Center binding -->
      <rect x="-8" y="-63" width="16" height="113" fill="${colors.primary}"/>
      <rect x="-6" y="-63" width="12" height="113" fill="${colors.primaryLight}"/>
      
      <!-- Bookmark -->
      <path d="M -3 -63 L -3 35 L 0 27 L 3 35 L 3 -63 Z" fill="${colors.accent}"/>
      
      <!-- Arabic text -->
      <text x="-36" y="-30" font-family="Arial" font-size="18" font-weight="bold"
            fill="${colors.primary}" text-anchor="middle">القرآن</text>
      <line x1="-53" y1="-10" x2="-20" y2="-10" stroke="${colors.accent}" stroke-width="1.5" opacity="0.6"/>
      <line x1="-53" y1="2" x2="-20" y2="2" stroke="${colors.accent}" stroke-width="1" opacity="0.4"/>
      
      <line x1="20" y1="-40" x2="53" y2="-40" stroke="${colors.accent}" stroke-width="1.5" opacity="0.6"/>
      <line x1="20" y1="-28" x2="53" y2="-28" stroke="${colors.accent}" stroke-width="1" opacity="0.4"/>
      <line x1="20" y1="-16" x2="53" y2="-16" stroke="${colors.accent}" stroke-width="1" opacity="0.4"/>
    </g>
  </svg>
`;

async function generate() {
  await sharp(Buffer.from(svg))
    .png()
    .toFile('assets/images/splash.png');
  console.log('✅ Android splash icon created (288x288)');
}

generate();
