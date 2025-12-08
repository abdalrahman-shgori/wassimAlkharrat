/**
 * Script to seed two admin users into the database
 * Run with: npm run seed:admins
 * 
 * Default credentials:
 * Admin 1: admin1@eventplanner.com / Admin123!
 * Admin 2: admin2@eventplanner.com / Admin456!
 */

// IMPORTANT: Load environment variables FIRST, before any other imports
import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

// Now import everything else
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

async function seedAdmins() {
  let client: MongoClient | null = null;
  
  try {
    console.log("Checking environment variables...");
    console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✓ Set" : "✗ NOT SET");
    console.log("AUTH_SECRET:", process.env.AUTH_SECRET ? "✓ Set" : "✗ NOT SET");
    
    if (!process.env.MONGODB_URI) {
      console.error("\n❌ ERROR: MONGODB_URI is not set in .env.local");
      console.error("Please create a .env.local file with:");
      console.error("MONGODB_URI=mongodb://localhost:27017/event_planner");
      process.exit(1);
    }
    
    console.log("\nConnecting to database...");
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db("event_planner");
    const adminsCollection = db.collection("admins");

    // Check if admins already exist
    const existingCount = await adminsCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing admin(s). Skipping seed.`);
      console.log("If you want to re-seed, please delete the admins collection first.");
      await client.close();
      process.exit(0);
    }

    console.log("Hashing passwords...");
    const password1Hash = await bcrypt.hash("Admin123!", 12);
    const password2Hash = await bcrypt.hash("Admin456!", 12);

    console.log("Creating admin users...");
    const admins = [
      {
        email: "admin1@eventplanner.com",
        passwordHash: password1Hash,
        name: "Admin One",
        role: "super_admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin2@eventplanner.com",
        passwordHash: password2Hash,
        name: "Admin Two",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "admin3@eventplanner.com",
        passwordHash: password2Hash,
        name: "Admin Three",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const result = await adminsCollection.insertMany(admins);
    console.log(`\n✓ Successfully created ${result.insertedCount} admin users!`);
    console.log("\nCredentials:");
    console.log("Admin 1: admin1@eventplanner.com / Admin123!");
    console.log("Admin 2: admin2@eventplanner.com / Admin456!");
    console.log("\nPlease change these passwords in production!");

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding admins:", error);
    if (client) {
      await client.close();
    }
    process.exit(1);
  }
}

seedAdmins();
