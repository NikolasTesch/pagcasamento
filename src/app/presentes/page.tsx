import { db } from "@/lib/firebase";
import GiftsPageClient from "./GiftsPageClient";
import * as fs from "fs";
import * as path from "path";
import { Suspense } from "react";

// Permite que o Next.js armazene a página em cache por 10 segundos (ISR), tornando a navegação instantânea
export const revalidate = 10;

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
            imageUrl: data.imageUrl || `/images/gifts/${doc.id}.webp`,
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

  // 2. Fallback de Segurança: Se banco estiver vazio ou falhar, lê do config.json na raiz
  if (gifts.length === 0) {
    console.log("[Server Component] Banco de dados indisponível ou vazio. Ativando fallback para config.json...");
    
    try {
      const configPath = path.join(process.cwd(), "config.json");
      if (fs.existsSync(configPath)) {
        const fileData = fs.readFileSync(configPath, "utf-8");
        const config = JSON.parse(fileData);
        
        gifts = (config.gifts || []).map((g: any) => ({
          id: g.id,
          name: g.name,
          description: g.description,
          value: Number(g.value),
          imageUrl: g.imageUrl || `/images/gifts/${g.id}.webp`,
          category: g.category,
          is_crowdfunding: !!g.is_crowdfunding,
          amount_collected: Number(g.amount_collected || 0),
          is_purchased: !g.available,
        }));
      }
    } catch (fsError) {
      console.error("Erro ao ler fallback do config.json:", fsError);
    }
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] font-sans text-[#6A6660]">Carregando lista de presentes...</div>}>
      <GiftsPageClient initialGifts={gifts} />
    </Suspense>
  );
}
