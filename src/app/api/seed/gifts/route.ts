import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import * as fs from "fs";
import * as path from "path";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const adminToken = searchParams.get("admin_token") ?? req.headers.get("x-admin-token") ?? "";
  const expectedToken = process.env.SEED_ADMIN_TOKEN ?? "";

  if (!expectedToken || adminToken !== expectedToken) {
    return NextResponse.json({ success: false, message: "Não autorizado." }, { status: 401 });
  }

  try {
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
      return NextResponse.json(
        {
          success: false,
          message: "Firebase não configurado! Configure o .env.local com as credenciais do Firebase.",
        },
        { status: 400 }
      );
    }

    // Lê a lista atualizada do config.json na raiz do projeto
    const configPath = path.join(process.cwd(), "config.json");
    if (!fs.existsSync(configPath)) {
      return NextResponse.json(
        { success: false, message: "config.json não encontrado na raiz do projeto." },
        { status: 400 }
      );
    }

    const fileData = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(fileData);
    const rawGifts: any[] = config.gifts || [];

    // Mapeia para o formato do Firestore
    const giftsToSeed = rawGifts.map((g: any) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      value: Number(g.value),
      imageUrl: g.imageUrl || `/images/gifts/${g.id}.png`,
      category: g.category,
      is_crowdfunding: !!g.is_crowdfunding,
      amount_collected: Number(g.amount_collected || 0),
      is_purchased: !g.available,
    }));

    // Salva no Firestore
    const giftsCollection = db.collection("gifts");
    const batch = db.batch();

    for (const gift of giftsToSeed) {
      const docRef = giftsCollection.doc(gift.id);
      batch.set(docRef, gift, { merge: true });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: "Lista de presentes semeada com sucesso no Firestore!",
      seededCount: giftsToSeed.length,
      items: giftsToSeed,
    });
  } catch (error: any) {
    console.error("Erro ao semear presentes:", error);
    return NextResponse.json(
      { success: false, message: "Erro no servidor.", error: error.message },
      { status: 500 }
    );
  }
}
