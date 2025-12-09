import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServicesCollection } from "../../../../../lib/db";
import { UpdateServiceInput } from "../../../../../lib/models/Service";
import { requireAdmin } from "../../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../../lib/i18n/serverLocale";

// GET /api/services/[id] - Get a single service by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const locale = getPreferredLocale(request);

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const servicesCollection = await getServicesCollection();
    const service = await servicesCollection.findOne({ _id: new ObjectId(id) });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    const nameEn = service.nameEn ?? service.name ?? "";
    const descriptionEn = service.descriptionEn ?? service.description ?? "";
    const nameAr = service.nameAr ?? null;
    const descriptionAr = service.descriptionAr ?? null;

    return NextResponse.json({
      success: true,
      data: {
        ...service,
        name: pickLocalizedString(locale, { en: nameEn, ar: nameAr }),
        description: pickLocalizedString(locale, { en: descriptionEn, ar: descriptionAr }),
        nameEn,
        nameAr: nameAr ?? "",
        descriptionEn,
        descriptionAr: descriptionAr ?? "",
      },
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PUT /api/services/[id] - Update a service (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    await requireAdmin();

    const { id } = await params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const body: UpdateServiceInput = await request.json();
    const servicesCollection = await getServicesCollection();

    // Check if service exists
    const existingService = await servicesCollection.findOne({ _id: new ObjectId(id) });
    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // If slug is being updated, check for duplicates
    if (body.slug && body.slug !== existingService.slug) {
      const duplicateSlug = await servicesCollection.findOne({ 
        slug: body.slug,
        _id: { $ne: new ObjectId(id) }
      });
      if (duplicateSlug) {
        return NextResponse.json(
          { error: "A service with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.nameEn !== undefined) updateData.nameEn = body.nameEn;
    if (body.nameAr !== undefined) updateData.nameAr = body.nameAr;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.descriptionEn !== undefined) updateData.descriptionEn = body.descriptionEn;
    if (body.descriptionAr !== undefined) updateData.descriptionAr = body.descriptionAr;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.order !== undefined) updateData.order = body.order;

    // Update service
    const result = await servicesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE /api/services/[id] - Delete a service (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    await requireAdmin();

    const { id } = await params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid service ID" },
        { status: 400 }
      );
    }

    const servicesCollection = await getServicesCollection();

    // Check if service exists
    const existingService = await servicesCollection.findOne({ _id: new ObjectId(id) });
    if (!existingService) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    // Delete service
    await servicesCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}

