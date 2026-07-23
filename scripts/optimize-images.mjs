/**
 * Script para otimizar imagens da pasta public/images/
 * Converte PNGs/JPGs para WebP com qualidade balanceada.
 * Uso: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.resolve(__dirname, "..", "public", "images");
const QUALITY = 80; // WebP quality (0-100)
const MAX_DIMENSION = 1920; // Max width/height for large images

const stats = { converted: 0, skipped: 0, errors: 0 };

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return;

  const webpPath = filePath.replace(/\.(png|jpg|jpeg)$/i, ".webp");
  if (fs.existsSync(webpPath)) {
    stats.skipped++;
    return;
  }

  try {
    const metadata = await sharp(filePath).metadata();
    let pipeline = sharp(filePath);

    // Redimensiona imagens muito grandes
    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
      pipeline = pipeline.resize({
        width: metadata.width > MAX_DIMENSION ? MAX_DIMENSION : undefined,
        height: metadata.height > MAX_DIMENSION ? MAX_DIMENSION : undefined,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    await pipeline.webp({ quality: QUALITY, effort: 4 }).toFile(webpPath);

    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    console.log(
      `✓ ${path.basename(filePath)} → ${path.basename(webpPath)} ` +
      `(${(originalSize / 1024).toFixed(0)}KB → ${(webpSize / 1024).toFixed(0)}KB, -${savings}%)`
    );
    stats.converted++;
  } catch (err) {
    console.error(`✗ Erro ao converter ${path.basename(filePath)}:`, err.message);
    stats.errors++;
  }
}

async function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath);
    } else if (entry.isFile()) {
      await optimizeFile(fullPath);
    }
  }
}

console.log("🔧 Otimizando imagens em:", IMAGES_DIR);
console.log("");

try {
  await walkDir(IMAGES_DIR);
  console.log("");
  console.log("✅ Concluído!");
  console.log(`   Convertidos: ${stats.converted}`);
  console.log(`   Pulados (já existem): ${stats.skipped}`);
  console.log(`   Erros: ${stats.errors}`);
  console.log("");
  console.log("📝 Lembre-se de atualizar as referências nos componentes");
  console.log("   para usar os novos arquivos .webp!");
} catch (err) {
  console.error("Erro fatal:", err);
  process.exit(1);
}
