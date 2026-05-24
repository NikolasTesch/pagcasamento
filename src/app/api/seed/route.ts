import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import * as fs from "fs";
import * as path from "path";

export async function GET(req: Request) {
  // Exige token de admin para proteger a operação destrutiva de re-seed
  const { searchParams } = new URL(req.url);
  const adminToken = searchParams.get("admin_token") ?? req.headers.get("x-admin-token") ?? "";
  const expectedToken = process.env.SEED_ADMIN_TOKEN ?? "";

  if (!expectedToken || adminToken !== expectedToken) {
    return NextResponse.json({ success: false, message: "Não autorizado." }, { status: 401 });
  }

  try {
    // 1. Verifica se o Firebase foi configurado nas variáveis de ambiente
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
      return NextResponse.json(
        {
          success: false,
          message: "Firebase não configurado! Por favor, configure o arquivo .env.local com as credenciais obtidas no console do Firebase.",
        },
        { status: 400 }
      );
    }

    const giftsCollection = db.collection("gifts");

    // 1.5. Zerar o banco de dados deletando documentos das coleções 'gifts', 'pending_contributions' e 'contributions'
    const giftsSnapshot = await db.collection("gifts").get();
    const pendingSnapshot = await db.collection("pending_contributions").get();
    const contributionsSnapshot = await db.collection("contributions").get();

    const deleteBatch = db.batch();
    giftsSnapshot.docs.forEach((doc: any) => {
      deleteBatch.delete(doc.ref);
    });
    pendingSnapshot.docs.forEach((doc: any) => {
      deleteBatch.delete(doc.ref);
    });
    contributionsSnapshot.docs.forEach((doc: any) => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();
    console.log(`[Seed API] Banco zerado com sucesso: deletados ${giftsSnapshot.size} presentes, ${pendingSnapshot.size} pendentes, ${contributionsSnapshot.size} contribuições.`);

    // 2. Lê a configuração do config.json original a partir do backup
    const configPath = path.join(process.cwd(), "backup-vanilla", "config.json");
    let initialGifts = [];

    if (fs.existsSync(configPath)) {
      const fileData = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(fileData);
      initialGifts = config.gifts || [];
    } else {
      console.warn("backup-vanilla/config.json não encontrado. Usando lista padrão embutida.");
      initialGifts = [
        { id: "gift-001", name: "Jogo de Pratos", description: "Conjunto elegante de pratos de porcelana para servir nossa família", value: 150.00, category: "Cozinha" },
        { id: "gift-002", name: "Micro-ondas Espelhado", description: "Praticidade e estilo para preparar deliciosas receitas", value: 450.00, category: "Eletrodomésticos" },
        { id: "gift-003", name: "Jogo de Toalhas de Banho", description: "Conjunto macio e felpudo de toalhas 100% algodão", value: 120.00, category: "Cama, Mesa & Banho" },
        { id: "gift-004", name: "Cafeteira Nespresso", description: "Para começarmos nossos dias com aquele café especial", value: 350.00, category: "Eletrodomésticos" },
        { id: "gift-005", name: "Fitas de LED decorativas", description: "Iluminação aconchegante para a nossa nova sala de estar", value: 80.00, category: "Decoração" }
      ];
    }

    // 3. Mapeia a lista oficial de presentes a partir do config.json de backup
    const allGiftsToSeed = initialGifts.map((g: any) => ({
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

    // 4. Salva no Firestore
    const batch = db.batch();
    
    for (const gift of allGiftsToSeed) {
      const docRef = giftsCollection.doc(gift.id);
      batch.set(docRef, gift, { merge: true });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: "Banco de dados de presentes semeado com sucesso no Firebase Firestore!",
      seededCount: allGiftsToSeed.length,
      items: allGiftsToSeed,
    });
  } catch (error: any) {
    console.error("Erro ao semear o banco de dados:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erro no servidor ao semear o banco de dados.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
