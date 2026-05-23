import { db } from "@/lib/firebase";
import GiftsPageClient from "./GiftsPageClient";
import * as fs from "fs";
import * as path from "path";

// Garante que a página sempre consulte o banco dinamicamente a cada requisição
export const revalidate = 0;

interface Gift {
  id: string;
  name: string;
  description: string;
  value: number;
  imageUrl: string;
  category: string;
  is_crowdfunding?: boolean;
  amount_collected?: number;
  is_purchased?: boolean;
}

export default async function PresentesPage() {
  let gifts: Gift[] = [];

  try {
    // 1. Tenta buscar os dados do Firestore
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
      console.log("[Server Component] Consultando Firestore para obter a lista de presentes...");
      const snapshot = await db.collection("gifts").orderBy("id").get();
      
      if (!snapshot.empty) {
        gifts = snapshot.docs.map((doc: any) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            value: Number(data.value || 0),
            imageUrl: data.imageUrl || `/images/gifts/${doc.id}.png`,
            category: data.category,
            is_crowdfunding: !!data.is_crowdfunding,
            amount_collected: Number(data.amount_collected || 0),
            is_purchased: !!data.is_purchased,
          };
        });
      }
    }
  } catch (error) {
    console.error("Falha ao buscar presentes do Firebase Firestore:", error);
  }

  // 2. Fallback de Segurança: Se banco estiver vazio ou falhar, lê de backup-vanilla/config.json
  if (gifts.length === 0) {
    console.log("[Server Component] Banco de dados indisponível ou vazio. Ativando fallback para config.json...");
    
    try {
      const configPath = path.join(process.cwd(), "backup-vanilla", "config.json");
      if (fs.existsSync(configPath)) {
        const fileData = fs.readFileSync(configPath, "utf-8");
        const config = JSON.parse(fileData);
        
        gifts = (config.gifts || []).map((g: any) => ({
          id: g.id,
          name: g.name,
          description: g.description,
          value: Number(g.value),
          imageUrl: g.imageUrl || `/images/gifts/${g.id}.png`,
          category: g.category,
          is_crowdfunding: false, // Por padrão, no original não há vaquinhas
          amount_collected: 0,
          is_purchased: !g.available, // available: false significa que foi comprado
        }));
      }
    } catch (fsError) {
      console.error("Erro ao ler fallback do config.json:", fsError);
    }
  }

  // 3. Fallback Final (In-Memory) se tudo falhar para garantir que o site nunca caia
  if (gifts.length === 0) {
    gifts = [
      {
        id: "gift-001",
        name: "Jogo de Pratos",
        description: "Conjunto elegante de pratos de porcelana para servir nossa família",
        value: 150.00,
        imageUrl: "/images/gifts/gift-001.png",
        category: "Cozinha",
        is_crowdfunding: false,
        amount_collected: 0,
        is_purchased: false,
      },
      {
        id: "gift-002",
        name: "Micro-ondas Espelhado",
        description: "Praticidade e estilo para preparar deliciosas receitas",
        value: 450.00,
        imageUrl: "/images/gifts/gift-002.png",
        category: "Eletrodomésticos",
        is_crowdfunding: false,
        amount_collected: 0,
        is_purchased: false,
      },
    ];
  }

  return <GiftsPageClient initialGifts={gifts} />;
}
