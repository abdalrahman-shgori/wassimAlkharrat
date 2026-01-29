import { NextRequest, NextResponse } from "next/server";
import { getGalleryCategoriesCollection } from "../../../../lib/db";
import { CreateGalleryCategoryInput } from "../../../../lib/models/GalleryCategory";
import { requireAdmin } from "../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../lib/i18n/serverLocale";

// GET /api/gallery-categories - Get all gallery categories
export async function GET(request: NextRequest) {
  try {
    const categoriesCollection = await getGalleryCategoriesCollection();
    const locale = getPreferredLocale(request);
    
    const activeOnly = request.nextUrl.searchParams.get("active") === "true";
    
    // Build query
    let query: any = {};
    if (activeOnly) {
      query.isActive = true;
    }
    
    // Fetch categories sorted by order, then by creation date
    const categories = await categoriesCollection
      .find(query)
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    const localized = categories.map((category) => {
      return {
        ...category,
        name: pickLocalizedString(locale, { en: category.nameEn, ar: category.nameAr }),
      };
    });
    
    return NextResponse.json({
      success: true,
      data: localized,
    });
  } catch (error) {
    console.error("Error fetching gallery categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery categories" },
      { status: 500 }
    );
  }
}

// POST /api/gallery-categories - Create a new gallery category (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const body: CreateGalleryCategoryInput = await request.json();
    
    // Validate required fields
    if (!body.key || !body.nameEn || !body.nameAr) {
      return NextResponse.json(
        { error: "Key, English name, and Arabic name are required" },
        { status: 400 }
      );
    }

    const categoriesCollection = await getGalleryCategoriesCollection();

    // Check if key already exists
    const existingCategory = await categoriesCollection.findOne({ key: body.key });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this key already exists" },
        { status: 400 }
      );
    }

    // Get max order if not provided
    let order = body.order;
    if (order === undefined) {
      const maxOrderCategory = await categoriesCollection
        .findOne({}, { sort: { order: -1 } });
      order = maxOrderCategory?.order ? maxOrderCategory.order + 1 : 0;
    }

    // Create new category
    const newCategory: any = {
      key: body.key,
      nameEn: body.nameEn,
      nameAr: body.nameAr,
      order: order,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await categoriesCollection.insertOne(newCategory);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newCategory },
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error creating gallery category:", error);
    return NextResponse.json(
      { error: "Failed to create gallery category" },
      { status: 500 }
    );
  }
}
