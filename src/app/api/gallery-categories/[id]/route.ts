import { NextRequest, NextResponse } from "next/server";
import { getGalleryCategoriesCollection } from "../../../../../lib/db";
import { UpdateGalleryCategoryInput } from "../../../../../lib/models/GalleryCategory";
import { requireAdmin } from "../../../../../lib/auth";
import { ObjectId } from "mongodb";

// GET /api/gallery-categories/[id] - Get a single gallery category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const categoriesCollection = await getGalleryCategoriesCollection();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const category = await categoriesCollection.findOne({ _id: new ObjectId(id) });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching gallery category:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery category" },
      { status: 500 }
    );
  }
}

// PUT /api/gallery-categories/[id] - Update a gallery category (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    await requireAdmin();

    const categoriesCollection = await getGalleryCategoriesCollection();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const body: UpdateGalleryCategoryInput = await request.json();

    // Check if key is being changed and if it conflicts
    if (body.key) {
      const existingCategory = await categoriesCollection.findOne({ 
        key: body.key,
        _id: { $ne: new ObjectId(id) }
      });
      if (existingCategory) {
        return NextResponse.json(
          { error: "Category with this key already exists" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.key !== undefined) updateData.key = body.key;
    if (body.nameEn !== undefined) updateData.nameEn = body.nameEn;
    if (body.nameAr !== undefined) updateData.nameAr = body.nameAr;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const result = await categoriesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const updatedCategory = await categoriesCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      data: updatedCategory,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error updating gallery category:", error);
    return NextResponse.json(
      { error: "Failed to update gallery category" },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery-categories/[id] - Delete a gallery category (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    await requireAdmin();

    const categoriesCollection = await getGalleryCategoriesCollection();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Check if any gallery images are using this category
    const { getGalleryCollection } = await import("../../../../../lib/db");
    const galleryCollection = await getGalleryCollection();
    const imagesUsingCategory = await galleryCollection.countDocuments({ 
      category: id 
    });

    if (imagesUsingCategory > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. ${imagesUsingCategory} image(s) are using this category.` },
        { status: 400 }
      );
    }

    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error deleting gallery category:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery category" },
      { status: 500 }
    );
  }
}
