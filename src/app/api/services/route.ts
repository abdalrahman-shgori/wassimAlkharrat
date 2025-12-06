import { NextRequest, NextResponse } from "next/server";
import { getServicesCollection } from "../../../../lib/db";
import { CreateServiceInput } from "../../../../lib/models/Service";
import { requireAdmin } from "../../../../lib/auth";

// GET /api/services - Get all services
export async function GET(request: NextRequest) {
  try {
    const servicesCollection = await getServicesCollection();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    
    // Build query
    const query = activeOnly ? { isActive: true } : {};
    
    // Fetch services sorted by order
    const services = await servicesCollection
      .find(query)
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: services,
      count: services.length,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST /api/services - Create a new service (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const body: CreateServiceInput = await request.json();
    
    // Validate required fields
    if (!body.name || !body.slug || !body.description) {
      return NextResponse.json(
        { error: "Name, slug, and description are required" },
        { status: 400 }
      );
    }

    const servicesCollection = await getServicesCollection();
    
    // Check if slug already exists
    const existingService = await servicesCollection.findOne({ slug: body.slug });
    if (existingService) {
      return NextResponse.json(
        { error: "A service with this slug already exists" },
        { status: 409 }
      );
    }

    // Get the highest order number
    const lastService = await servicesCollection
      .find()
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    
    const nextOrder = lastService.length > 0 ? (lastService[0].order || 0) + 1 : 1;

    // Create new service
    const newService = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      icon: body.icon || "🎉",
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order !== undefined ? body.order : nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await servicesCollection.insertOne(newService);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newService },
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

