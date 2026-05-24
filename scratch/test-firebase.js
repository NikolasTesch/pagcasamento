const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Load .env.local manually
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach(line => {
    const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      // remove quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("Has PRIVATE_KEY:", !!process.env.FIREBASE_PRIVATE_KEY);

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  const db = admin.firestore();
  
  async function run() {
    console.log("\n--- Checking 'gifts' collection ---");
    const giftsSnapshot = await db.collection("gifts").get();
    console.log("Total gifts in Firestore:", giftsSnapshot.size);
    giftsSnapshot.forEach(doc => {
      console.log(`- [${doc.id}]:`, doc.data().name, `(Value: ${doc.data().value}, Crowdfunding: ${doc.data().is_crowdfunding}, Purchased: ${doc.data().is_purchased})`);
    });

    console.log("\n--- Checking 'pending_contributions' collection ---");
    const pendingSnapshot = await db.collection("pending_contributions").get();
    console.log("Total pending:", pendingSnapshot.size);
    pendingSnapshot.forEach(doc => {
      console.log(`- [${doc.id}]:`, doc.data().guest_name, `Gift: ${doc.data().gift_name || doc.data().gift_id}, Status: ${doc.data().status}`);
    });
  }

  run().catch(err => console.error("Error running query:", err));
} catch (error) {
  console.error("Initialization error:", error);
}
