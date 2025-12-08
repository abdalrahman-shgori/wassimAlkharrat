import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("event_planner");
    
    // Get database info
    const adminDb = client.db().admin();
    const serverStatus = await adminDb.serverStatus();
    const collections = await db.listCollections().toArray();
    
    // Get connection URI info (without password)
    const uri = process.env.MONGODB_URI || "Not set";
    const uriInfo = uri.includes("localhost") || uri.includes("127.0.0.1") 
      ? "⚠️ LOCAL MongoDB" 
      : "✅ ONLINE MongoDB (Atlas)";

    return Response.json({
      success: true,
      message: "Connected to MongoDB!",
      database: "event_planner",
      connectionType: uriInfo,
      uri: uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"), // Hide password
      host: serverStatus.host,
      collections: collections.map(c => c.name),
      collectionCount: collections.length
    });
  } catch (error: any) {
    return Response.json({
      success: false,
      message: "Connection failed",
      error: error.message,
      uri: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@") : "Not set"
    }, { status: 500 });
  }
}
