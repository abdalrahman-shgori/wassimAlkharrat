/**
 * Script to seed initial services into the database
 * Run with: npm run seed:services
 * 
 * Initial services:
 * 1. Weddings
 * 2. Birthdays
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { MongoClient } from "mongodb";

async function seedServices() {
  let client: MongoClient | null = null;
  
  try {
    console.log("Checking environment variables...");
    
    if (!process.env.MONGODB_URI) {
      console.error("\n❌ ERROR: MONGODB_URI is not set in .env.local");
      process.exit(1);
    }
    
    console.log("\nConnecting to database...");
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db("event_planner");
    const servicesCollection = db.collection("services");

    // Check if services already exist
    const existingCount = await servicesCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing service(s). Skipping seed.`);
      console.log("If you want to re-seed, please delete the services collection first.");
      await client.close();
      process.exit(0);
    }

    console.log("Creating services...");
    const services = [
      {
        name: "Weddings",
        slug: "weddings",
        description: "Create unforgettable wedding celebrations with our comprehensive planning services. From intimate ceremonies to grand receptions, we handle every detail to make your special day perfect.",
        icon: "💍",
        isActive: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Birthdays",
        slug: "birthdays",
        description: "Celebrate life's milestones with spectacular birthday parties. Whether it's a children's party, sweet sixteen, or milestone celebration, we create memorable experiences for all ages.",
        icon: "🎂",
        isActive: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const result = await servicesCollection.insertMany(services);
    console.log(`\n✓ Successfully created ${result.insertedCount} services!`);
    console.log("\nServices:");
    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.icon} ${service.name} (${service.slug})`);
    });

    await client.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding services:", error);
    if (client) {
      await client.close();
    }
    process.exit(1);
  }
}

seedServices();

