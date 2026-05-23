import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import * as fs from "fs";
import * as path from "path";

export async function GET() {
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

    // 3. Adiciona itens de alto valor para o teste da Vaquinha/Crowdfunding
    const crowdfundingGifts = [
      {
        id: "gift-006",
        name: "Cotas para Viagem de Lua de Mel",
        description: "Contribua com qualquer valor para nos ajudar a curtir a nossa inesquecível viagem de Lua de Mel em Porto de Galinhas!",
        value: 3000.00,
        category: "Lua de Mel",
        is_crowdfunding: true,
      },
      {
        id: "gift-007",
        name: "Geladeira Frost Free Inverse",
        description: "Geladeira duplex moderna com freezer invertido para a nossa nova cozinha",
        value: 4200.00,
        category: "Eletrodomésticos",
        is_crowdfunding: true,
      }
    ];

    // Mescla as duas listas
    const allGiftsToSeed = [
      ...initialGifts.map((g: any) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        value: Number(g.value),
        imageUrl: g.imageUrl || `/images/gifts/${g.id}.jpg`,
        category: g.category,
        is_crowdfunding: false,
        amount_collected: 0,
        is_purchased: false,
      })),
      ...crowdfundingGifts.map((g: any) => ({
        ...g,
        imageUrl: `/images/gifts/${g.id}.jpg`,
        amount_collected: 0,
        is_purchased: false,
      }))
    ];

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
