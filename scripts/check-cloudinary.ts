/**
 * Script to check if Cloudinary credentials are properly configured
 * Run with: npm run check:cloudinary
 * Or: tsx scripts/check-cloudinary.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

console.log("\n🔍 Checking Cloudinary Configuration...\n");

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

let allConfigured = true;

if (!cloudName) {
  console.log("❌ CLOUDINARY_CLOUD_NAME is missing");
  allConfigured = false;
} else {
  console.log("✅ CLOUDINARY_CLOUD_NAME:", cloudName);
}

if (!apiKey) {
  console.log("❌ CLOUDINARY_API_KEY is missing");
  allConfigured = false;
} else {
  console.log("✅ CLOUDINARY_API_KEY:", apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4));
}

if (!apiSecret) {
  console.log("❌ CLOUDINARY_API_SECRET is missing");
  allConfigured = false;
} else {
  console.log("✅ CLOUDINARY_API_SECRET:", apiSecret.substring(0, 4) + "..." + apiSecret.substring(apiSecret.length - 4));
}

console.log("\n" + "=".repeat(50));

if (allConfigured) {
  console.log("✅ All Cloudinary credentials are configured!");
  console.log("\n💡 If you're still getting errors:");
  console.log("   1. Make sure you're using .env.local (not .env)");
  console.log("   2. Restart your development server");
  console.log("   3. Check for typos in variable names");
} else {
  console.log("❌ Some Cloudinary credentials are missing!");
  console.log("\n📝 To fix this:");
  console.log("   1. Create or edit .env.local in the project root");
  console.log("   2. Add the following variables:");
  console.log("      CLOUDINARY_CLOUD_NAME=your-cloud-name");
  console.log("      CLOUDINARY_API_KEY=your-api-key");
  console.log("      CLOUDINARY_API_SECRET=your-api-secret");
  console.log("   3. Get credentials from: https://cloudinary.com/console");
  console.log("   4. Restart your development server");
}

console.log("\n");

