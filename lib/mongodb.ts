import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

// Validate MONGODB_URI is set
if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Warn if using local MongoDB in production
if (process.env.NODE_ENV === "production" && uri.includes("localhost")) {
  console.warn(
    "⚠️  WARNING: Using local MongoDB in production! This should be an online database."
  );
}

// Warn if connection string looks like local MongoDB
if (uri.startsWith("mongodb://localhost") || uri.startsWith("mongodb://127.0.0.1")) {
  console.warn(
    "⚠️  WARNING: Using local MongoDB connection. Make sure this is intentional."
  );
  console.warn("   If you want to use online MongoDB, update MONGODB_URI in .env.local");
}

const options = {};

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  // Fix for Hot Reloading in Next.js
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
