const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let key = match[1];
    let value = match[2] || "";
    if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
    env[key] = value;
  }
});

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

async function checkGifts() {
  const snapshot = await admin.firestore().collection("gifts").get();
  console.log("Total gifts in Firestore:", snapshot.size);
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    console.log(doc.id, "-> name:", data.name, "| imageUrl:", data.imageUrl);
  });
  process.exit(0);
}

checkGifts().catch((err) => {
  console.error(err);
  process.exit(1);
});
