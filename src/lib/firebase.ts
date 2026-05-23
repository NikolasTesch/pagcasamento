import * as admin from "firebase-admin";

let dbInstance: any = null;
let isConfigured = false;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Validação estrita para saber se as credenciais são reais ou apenas os placeholders do template
  const hasCredentials = 
    projectId && 
    projectId !== "seu-projeto-firebase-id" &&
    clientEmail && 
    clientEmail !== "firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com" &&
    privateKey && 
    privateKey.includes("-----BEGIN PRIVATE KEY-----");

  if (hasCredentials) {
    if (!admin.apps.length) {
      // Corrige quebras de linha formatadas na string do .env
      const formattedKey = privateKey!.replace(/\\n/g, "\n");

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: projectId,
          clientEmail: clientEmail,
          privateKey: formattedKey,
        }),
      });
      console.log("[Firebase Admin] Inicializado com sucesso com chaves reais!");
    }
    dbInstance = admin.firestore();
    isConfigured = true;
  } else {
    console.warn(
      "[Firebase Admin] Alerta: Credenciais reais do Firebase não encontradas no arquivo .env.local. Ativando Modo de Demonstração (Demo Mode)."
    );
  }
} catch (error) {
  console.error("[Firebase Admin] Erro catastrófico ao inicializar o SDK:", error);
}

// Se não estiver configurado, exportamos um Proxy seguro que não causa quebra de rotas ou chamadas no build
if (!dbInstance) {
  dbInstance = new Proxy({} as any, {
    get(target, prop) {
      return () => ({
        doc: () => ({
          get: async () => ({ exists: false, data: () => null }),
          set: async () => {},
          update: async () => {},
        }),
        orderBy: () => ({
          get: async () => ({ empty: true, docs: [] }),
        }),
        where: () => ({
          get: async () => ({ empty: true, docs: [] }),
        }),
        get: async () => ({ empty: true, docs: [] }),
        batch: () => ({
          update: () => {},
          set: () => {},
          commit: async () => {},
        }),
      });
    },
  });
}

export const db = dbInstance;
export const isFirebaseConfigured = isConfigured;
