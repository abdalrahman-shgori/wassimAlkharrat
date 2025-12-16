import { NextRequest, NextResponse } from "next/server";
import { getServiceFiltersCollection } from "../../../../lib/db";
import { CreateServiceFilterInput } from "../../../../lib/models/ServiceFilter";
import { requireAdmin } from "../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../lib/i18n/serverLocale";

// GET /api/service-filters - Get all service filters
export async function GET(request: NextRequest) {
  try {
    const serviceFiltersCollection = await getServiceFiltersCollection();
    const locale = getPreferredLocale(request);
    
    // Check if this is an admin request (by checking for auth cookie/header)
    // For public requests, only show active filters
    // For admin requests, show all filters
    let query: any = {};
    try {
      await requireAdmin();
      // Admin request - show all filters
    } catch {
      // Public request - only show active filters
      query.isActive = { $ne: false }; // Show active or undefined (for backward compatibility)
    }
    
    // Fetch filters sorted by newest first
    const filters = await serviceFiltersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const localized = filters.map((filter) => {
      return {
        ...filter,
        name: pickLocalizedString(locale, { en: filter.nameEn, ar: filter.nameAr }),
        nameEn: filter.nameEn,
        nameAr: filter.nameAr,
        isActive: filter.isActive !== false, // Default to true if not set
      };
    });

    return NextResponse.json({
      success: true,
      data: localized,
      count: localized.length,
    });
  } catch (error) {
    console.error("Error fetching service filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch service filters" },
      { status: 500 }
    );
  }
}

// POST /api/service-filters - Create a new service filter (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const body: CreateServiceFilterInput = await request.json();
    
    // Validate required fields
    if (!body.key || !body.nameEn || !body.nameAr) {
      return NextResponse.json(
        { error: "Key, English name, and Arabic name are required" },
        { status: 400 }
      );
    }

    const serviceFiltersCollection = await getServiceFiltersCollection();
    
    // Check if key already exists
    const existingFilter = await serviceFiltersCollection.findOne({ key: body.key });
    if (existingFilter) {
      return NextResponse.json(
        { error: "A filter with this key already exists" },
        { status: 409 }
      );
    }

    // Create new filter
    const newFilter = {
      key: body.key,
      nameEn: body.nameEn,
      nameAr: body.nameAr,
      isActive: body.isActive !== undefined ? body.isActive : true, // Default to true
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await serviceFiltersCollection.insertOne(newFilter);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newFilter },
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error creating service filter:", error);
    return NextResponse.json(
      { error: "Failed to create service filter" },
      { status: 500 }
    );
  }
}

