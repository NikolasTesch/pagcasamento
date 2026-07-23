import sharp from "sharp";
import fs from "fs";
import path from "path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const imagesDir = path.join(publicDir, "images");

const faviconSvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#D4AF37"/>
      <stop offset="100%" style="stop-color:#B8860B"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <text x="256" y="280" text-anchor="middle" font-family="Georgia, serif" font-size="200" font-weight="bold" fill="white">K&amp;L</text>
</svg>
`);

const faviconSizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
];

console.log("Generating favicon assets...");
for (const { name, size } of faviconSizes) {
  const outPath = path.join(publicDir, name);
  await sharp(faviconSvg).resize(size, size).png().toFile(outPath);
  console.log("  OK " + name + " (" + size + "x" + size + ")");
}

const icoPath = path.join(publicDir, "favicon.ico");
await sharp(faviconSvg).resize(32, 32).png().toFile(icoPath);
console.log("  OK favicon.ico (32x32 PNG)");

console.log("\nGenerating OG image...");
const heroPath = path.join(imagesDir, "hero-1.png");
const ogPath = path.join(imagesDir, "og-image.png");

if (fs.existsSync(heroPath)) {
  const meta = await sharp(heroPath).metadata();
  console.log("  Source: hero-1.png (" + meta.width + "x" + meta.height + ")");
  await sharp(heroPath)
    .resize(1200, 630, { fit: "cover", position: "center" })
    .png()
    .toFile(ogPath);
  console.log("  OK og-image.png (1200x630)");
} else {
  console.log("  hero-1.png not found, generating fallback OG image...");
  const ogSvg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <defs>
        <linearGradient id="ogbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#D4AF37"/>
          <stop offset="100%" style="stop-color:#8B6914"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#ogbg)"/>
      <text x="600" y="260" text-anchor="middle" font-family="Georgia, serif" font-size="96" font-weight="bold" fill="white">K &amp; L</text>
      <text x="600" y="340" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="rgba(255,255,255,0.9)">&#9679; Nosso Casamento &#9679;</text>
      <text x="600" y="400" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="rgba(255,255,255,0.7)">11 Outubro 2026</text>
    </svg>
  `);
  await sharp(ogSvg).resize(1200, 630).png().toFile(ogPath);
  console.log("  OK og-image.png (1200x630) - fallback generated");
}

console.log("\nDone! All assets generated.");
