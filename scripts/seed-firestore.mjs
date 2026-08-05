import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// 1. Carregar variáveis de ambiente do .env.local se existir
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const parts = trimmed.split("=");
      const key = parts[0].trim();
      let value = parts.slice(1).join("=").trim();
      // Remove aspas
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.error("ERRO: Credenciais do Firebase não encontradas no arquivo .env.local!");
  process.exit(1);
}

// Trata a chave privada
let cleanKey = privateKey.trim();
while ((cleanKey.startsWith('"') && cleanKey.endsWith('"')) || (cleanKey.startsWith("'") && cleanKey.endsWith("'"))) {
  cleanKey = cleanKey.slice(1, -1).trim();
}
const formattedKey = cleanKey.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: formattedKey,
    }),
  });
}

const db = admin.firestore();

async function seedDatabase() {
  console.log("🚀 Iniciando atualização do banco de dados Firebase Firestore...");
  
  const configPath = path.join(process.cwd(), "config.json");
  if (!fs.existsSync(configPath)) {
    console.error("ERRO: Arquivo config.json não encontrado!");
    process.exit(1);
  }

  const fileData = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(fileData);
  const gifts = config.gifts || [];

  console.log(`📦 Encontrados ${gifts.length} presentes no config.json.`);

  const batch = db.batch();
  const giftsCollection = db.collection("gifts");

  const validIds = new Set(gifts.map((g) => g.id));
  const existingDocs = await giftsCollection.get();
  let deletedCount = 0;
  let seededCount = 0;

  for (const doc of existingDocs.docs) {
    if (!validIds.has(doc.id)) {
      batch.delete(doc.ref);
      deletedCount++;
      console.log(`🗑️ Removendo presente obsoleto do Firestore: ${doc.id}`);
    }
  }

  for (const gift of gifts) {
    const docRef = giftsCollection.doc(gift.id);
    const giftData = {
      id: gift.id,
      name: gift.name,
      description: gift.description,
      value: Number(gift.value),
      imageUrl: gift.imageUrl || `/images/gifts/${gift.id}.webp`,
      category: gift.category,
      is_crowdfunding: gift.is_crowdfunding !== undefined ? !!gift.is_crowdfunding : false,
      amount_collected: Number(gift.amount_collected || 0),
      is_purchased: gift.available !== undefined ? !gift.available : false,
      updatedAt: new Date().toISOString(),
    };

    batch.set(docRef, giftData, { merge: true });
    seededCount++;
  }

  await batch.commit();
  if (deletedCount > 0) {
    console.log(`🗑️ ${deletedCount} presente(s) obsoleto(s) deletado(s) do Firestore.`);
  }
  console.log(`✅ SUCESSO! ${seededCount} presentes foram atualizados/enviados para o Firestore no projeto '${projectId}'.`);
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("❌ ERRO ao atualizar Firestore:", err);
  process.exit(1);
});
