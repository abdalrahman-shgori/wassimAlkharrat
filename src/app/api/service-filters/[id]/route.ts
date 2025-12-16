import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServiceFiltersCollection } from "../../../../../lib/db";
import { UpdateServiceFilterInput } from "../../../../../lib/models/ServiceFilter";
import { requireAdmin } from "../../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../../lib/i18n/serverLocale";

// GET /api/service-filters/[id] - Get a single filter by ID
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
        { error: "Invalid filter ID" },
        { status: 400 }
      );
    }

    const serviceFiltersCollection = await getServiceFiltersCollection();
    const filter = await serviceFiltersCollection.findOne({ _id: new ObjectId(id) });

    if (!filter) {
      return NextResponse.json(
        { error: "Filter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...filter,
        name: pickLocalizedString(locale, { en: filter.nameEn, ar: filter.nameAr }),
        nameEn: filter.nameEn,
        nameAr: filter.nameAr,
      },
    });
  } catch (error) {
    console.error("Error fetching service filter:", error);
    return NextResponse.json(
      { error: "Failed to fetch service filter" },
      { status: 500 }
    );
  }
}

// PUT /api/service-filters/[id] - Update a filter (Admin only)
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
        { error: "Invalid filter ID" },
        { status: 400 }
      );
    }

    const body: UpdateServiceFilterInput = await request.json();
    const serviceFiltersCollection = await getServiceFiltersCollection();

    // Check if filter exists
    const existingFilter = await serviceFiltersCollection.findOne({ _id: new ObjectId(id) });
    if (!existingFilter) {
      return NextResponse.json(
        { error: "Filter not found" },
        { status: 404 }
      );
    }

    // If key is being updated, check for duplicates
    if (body.key && body.key !== existingFilter.key) {
      const duplicateKey = await serviceFiltersCollection.findOne({ 
        key: body.key,
        _id: { $ne: new ObjectId(id) }
      });
      if (duplicateKey) {
        return NextResponse.json(
          { error: "A filter with this key already exists" },
          { status: 409 }
        );
      }
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.key !== undefined) updateData.key = body.key;
    if (body.nameEn !== undefined) updateData.nameEn = body.nameEn;
    if (body.nameAr !== undefined) updateData.nameAr = body.nameAr;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    // Update filter
    const result = await serviceFiltersCollection.findOneAndUpdate(
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
    console.error("Error updating service filter:", error);
    return NextResponse.json(
      { error: "Failed to update service filter" },
      { status: 500 }
    );
  }
}

// DELETE /api/service-filters/[id] - Delete a filter (Admin only)
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
        { error: "Invalid filter ID" },
        { status: 400 }
      );
    }

    const serviceFiltersCollection = await getServiceFiltersCollection();

    // Check if filter exists
    const existingFilter = await serviceFiltersCollection.findOne({ _id: new ObjectId(id) });
    if (!existingFilter) {
      return NextResponse.json(
        { error: "Filter not found" },
        { status: 404 }
      );
    }

    // Delete filter
    await serviceFiltersCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Filter deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error deleting service filter:", error);
    return NextResponse.json(
      { error: "Failed to delete service filter" },
      { status: 500 }
    );
  }
}

