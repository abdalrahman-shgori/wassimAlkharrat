import { NextRequest, NextResponse } from "next/server";
import { getGalleryCollection } from "../../../../lib/db";
import { CreateGalleryImageInput } from "../../../../lib/models/Gallery";
import { requireAdmin } from "../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../lib/i18n/serverLocale";

// GET /api/gallery - Get all gallery images with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const galleryCollection = await getGalleryCollection();
    const locale = getPreferredLocale(request);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const categoryFilter = searchParams.get("category");
    
    // Build query
    let query: any = {};
    if (activeOnly) {
      query.isActive = true;
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter !== "All") {
      query.category = categoryFilter;
    }
    
    // Get total count for pagination
    const total = await galleryCollection.countDocuments(query);
    
    // Fetch gallery images with pagination
    const images = await galleryCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Fetch category names if category is a key
    const { getGalleryCategoriesCollection } = await import("../../../../lib/db");
    const categoriesCollection = await getGalleryCategoriesCollection();
    const allCategories = await categoriesCollection.find({ isActive: true }).toArray();
    const categoryMap = new Map(allCategories.map(cat => [cat.key, cat]));

    const localized = images.map((image) => {
      // Try to get category name from categories collection
      const categoryData = categoryMap.get(image.category);
      const categoryEn = categoryData?.nameEn ?? image.categoryEn ?? image.category ?? "";
      const categoryAr = categoryData?.nameAr ?? image.categoryAr ?? null;

      return {
        ...image,
        category: categoryEn ? pickLocalizedString(locale, { en: categoryEn, ar: categoryAr }) : image.category,
        categoryEn: categoryEn,
        categoryAr: categoryAr ?? "",
      };
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return NextResponse.json({
      success: true,
      data: localized,
      count: localized.length,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}

// POST /api/gallery - Create a new gallery image (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const body: CreateGalleryImageInput = await request.json();
    const categoryEn = body.categoryEn ?? body.category;
    
    // Validate required fields
    if (!body.image || !body.category) {
      return NextResponse.json(
        { error: "Image and category are required" },
        { status: 400 }
      );
    }

    const galleryCollection = await getGalleryCollection();

    // Create new gallery image
    const newImage: any = {
      image: body.image,
      category: body.category,
      categoryEn: categoryEn,
      categoryAr: body.categoryAr || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await galleryCollection.insertOne(newImage);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newImage },
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error creating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to create gallery image" },
      { status: 500 }
    );
  }
}
