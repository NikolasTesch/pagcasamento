const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// 1. Carregar variáveis de ambiente do .env.local manualmente
const envPath = path.join(__dirname, "..", ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("Arquivo .env.local não encontrado!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let key = match[1];
    let value = match[2] || "";
    // Remove aspas se houver
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value;
  }
});

const projectId = env.FIREBASE_PROJECT_ID;
const clientEmail = env.FIREBASE_CLIENT_EMAIL;
let privateKey = env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.error("Credenciais do Firebase incompletas no .env.local!");
  process.exit(1);
}

// Corrige quebras de linha na chave privada
const formattedKey = privateKey.replace(/\\n/g, "\n");

// Inicializa Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: projectId,
    clientEmail: clientEmail,
    privateKey: formattedKey,
  }),
});

const db = admin.firestore();

async function runSeed() {
  try {
    console.log("=== INICIANDO OPERAÇÃO DE RESET E SEED DO FIRESTORE ===");
    
    // 1. ZERAR BANCO DE DADOS (Coleções: gifts, pending_contributions, contributions)
    console.log("1. Apagando registros antigos das coleções...");
    
    const giftsSnapshot = await db.collection("gifts").get();
    const pendingSnapshot = await db.collection("pending_contributions").get();
    const contributionsSnapshot = await db.collection("contributions").get();
    
    const deleteBatch = db.batch();
    giftsSnapshot.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    pendingSnapshot.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    contributionsSnapshot.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    
    await deleteBatch.commit();
    console.log(`✓ Limpeza concluída: deletados ${giftsSnapshot.size} presentes, ${pendingSnapshot.size} pendentes e ${contributionsSnapshot.size} contribuições.`);

    // 2. LER CONFIG.JSON DA RAIZ
    console.log("2. Carregando dados do config.json...");
    const configPath = path.join(__dirname, "..", "config.json");
    let initialGifts = [];
    
    if (fs.existsSync(configPath)) {
      const fileData = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(fileData);
      initialGifts = config.gifts || [];
    } else {
      console.warn("Aviso: backup-vanilla/config.json não encontrado. Usando lista padrão.");
      initialGifts = [
        { id: "gift-001", name: "Jogo de Pratos", description: "Conjunto elegante de pratos de porcelana para servir nossa família", value: 150.00, category: "Cozinha" },
        { id: "gift-002", name: "Micro-ondas Espelhado", description: "Praticidade e estilo para preparar deliciosas receitas", value: 450.00, category: "Eletrodomésticos" },
        { id: "gift-003", name: "Jogo de Toalhas de Banho", description: "Conjunto macio e felpudo de toalhas 100% algodão", value: 120.00, category: "Cama, Mesa & Banho" },
        { id: "gift-004", name: "Cafeteira Nespresso", description: "Para começarmos nossos dias com aquele café especial", value: 350.00, category: "Eletrodomésticos" },
        { id: "gift-005", name: "Fitas de LED decorativas", description: "Iluminação aconchegante para a nossa nova sala de estar", value: 80.00, category: "Decoração" }
      ];
    }

    // 3. MAPEIA A LISTA OFICIAL DE PRESENTES A PARTIR DO CONFIG.JSON DE BACKUP
    const allGiftsToSeed = initialGifts.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      value: Number(g.value),
      imageUrl: g.imageUrl || `/images/gifts/${g.id}.png`,
      category: g.category,
      is_crowdfunding: g.is_crowdfunding !== undefined ? !!g.is_crowdfunding : false,
      amount_collected: Number(g.amount_collected || 0),
      is_purchased: !g.available,
    }));

    // 4. GRAVAR NOVOS DADOS
    console.log(`3. Gravando ${allGiftsToSeed.length} presentes semeados...`);
    const writeBatch = db.batch();
    for (const gift of allGiftsToSeed) {
      const docRef = db.collection("gifts").doc(gift.id);
      writeBatch.set(docRef, gift);
    }
    await writeBatch.commit();
    
    console.log("=== SUCESSO: BANCO DE DADOS RESETADO E SEMEADO COM ÊXITO! ===");
    process.exit(0);
  } catch (error) {
    console.error("Erro catastrófico ao rodar o seed:", error);
    process.exit(1);
  }
}

runSeed();
