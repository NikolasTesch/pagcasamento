const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
const content = fs.readFileSync(envPath, "utf-8");

// Extract FIREBASE_PRIVATE_KEY line
const lines = content.split("\n");
const pkLine = lines.find(l => l.startsWith("FIREBASE_PRIVATE_KEY="));

if (!pkLine) {
  console.log("No private key line found!");
  process.exit(1);
}

console.log("Raw line length:", pkLine.length);

// Extract value
let rawVal = pkLine.substring("FIREBASE_PRIVATE_KEY=".length).trim();
console.log("Raw value starts with:", rawVal.substring(0, 40));
console.log("Raw value ends with:", rawVal.substring(rawVal.length - 40));

if (rawVal.startsWith('"') && rawVal.endsWith('"')) {
  rawVal = rawVal.slice(1, -1);
} else if (rawVal.startsWith("'") && rawVal.endsWith("'")) {
  rawVal = rawVal.slice(1, -1);
}

console.log("After stripping quotes, starts with:", rawVal.substring(0, 40));
console.log("After stripping quotes, ends with:", rawVal.substring(rawVal.length - 40));

const replaced = rawVal.replace(/\\n/g, "\n");
console.log("Replaced starts with:", replaced.substring(0, 40));
console.log("Replaced ends with:", replaced.substring(replaced.length - 40));

console.log("\nNumber of lines in replaced key:", replaced.split("\n").length);
console.log("First line:", replaced.split("\n")[0]);
console.log("Second line:", replaced.split("\n")[1]);
console.log("Last line:", replaced.split("\n")[replaced.split("\n").length - 1]);
