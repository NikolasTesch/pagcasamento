const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF7F2"/>
      <stop offset="100%" stop-color="#F3ECDE"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37"/>
      <stop offset="50%" stop-color="#B89736"/>
      <stop offset="100%" stop-color="#967727"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#3D372E" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Background Circle -->
  <circle cx="256" cy="256" r="248" fill="url(#bgGrad)" filter="url(#shadow)"/>
  <circle cx="256" cy="256" r="232" fill="none" stroke="url(#goldGrad)" stroke-width="5"/>
  <circle cx="256" cy="256" r="220" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="6,6"/>

  <!-- Leaf Accents Left -->
  <path d="M 125,256 C 110,230 90,220 78,210 C 95,225 112,240 125,256 Z" fill="url(#goldGrad)" opacity="0.85"/>
  <path d="M 120,220 C 102,200 85,195 73,185 C 90,195 107,210 120,220 Z" fill="url(#goldGrad)" opacity="0.85"/>
  <path d="M 125,292 C 110,318 90,328 78,338 C 95,323 112,308 125,292 Z" fill="url(#goldGrad)" opacity="0.85"/>
  <path d="M 120,328 C 102,348 85,353 73,363 C 90,353 107,338 120,328 Z" fill="url(#goldGrad)" opacity="0.85"/>

  <!-- Leaf Accents Right -->
  <path d="M 387,256 C 402,230 422,220 434,210 C 417,225 400,240 387,256 Z" fill="url(#goldGrad)" opacity="0.85"/>
  <path d="M 392,220 C 410,200 427,195 439,185 C 422,195 405,210 392,220 Z" fill="url(#goldGrad)" opacity="0.85"/>
  <path d="M 387,292 C 402,318 422,328 434,338 C 417,323 400,308 387,292 Z" fill="url(#goldGrad)" opacity="0.85"/>
  <path d="M 392,328 C 410,348 427,353 439,363 C 422,353 405,338 392,328 Z" fill="url(#goldGrad)" opacity="0.85"/>

  <!-- Heart Icon Top -->
  <path d="M 256,128 C 250,116 234,110 222,122 C 210,135 224,154 256,178 C 288,154 302,135 290,122 C 278,110 262,116 256,128 Z" fill="url(#goldGrad)"/>

  <!-- Monogram Text K & L -->
  <text x="256" y="298" font-family="Georgia, serif" font-size="148" font-weight="bold" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="2">
    K &amp; L
  </text>

  <!-- Date Subtitle -->
  <text x="256" y="362" font-family="sans-serif" font-size="26" font-weight="bold" fill="#5C5549" text-anchor="middle" letter-spacing="6">
    11 · 10 · 2026
  </text>
</svg>`;

const publicDir = path.join(process.cwd(), 'public');
const appDir = path.join(process.cwd(), 'src', 'app');

async function generate() {
  const buf512 = await sharp(Buffer.from(svg)).resize(512, 512).png().toBuffer();
  const buf180 = await sharp(Buffer.from(svg)).resize(180, 180).png().toBuffer();
  const buf32 = await sharp(Buffer.from(svg)).resize(32, 32).png().toBuffer();
  const buf16 = await sharp(Buffer.from(svg)).resize(16, 16).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'android-chrome-512x512.png'), buf512);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), buf180);
  fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), buf32);
  fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), buf16);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buf32);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), buf32);

  console.log('✓ All favicons generated successfully!');
}

generate().catch(console.error);
