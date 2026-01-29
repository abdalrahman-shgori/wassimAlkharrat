import { NextRequest, NextResponse } from "next/server";
import { getGalleryCollection } from "../../../../../lib/db";
import { UpdateGalleryImageInput } from "../../../../../lib/models/Gallery";
import { requireAdmin } from "../../../../../lib/auth";
import { ObjectId } from "mongodb";

// GET /api/gallery/[id] - Get a single gallery image
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const galleryCollection = await getGalleryCollection();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid gallery image ID" },
        { status: 400 }
      );
    }

    const image = await galleryCollection.findOne({ _id: new ObjectId(id) });

    if (!image) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery image" },
      { status: 500 }
    );
  }
}

// PUT /api/gallery/[id] - Update a gallery image (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    await requireAdmin();

    const { id } = await params;
    const galleryCollection = await getGalleryCollection();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid gallery image ID" },
        { status: 400 }
      );
    }

    const body: UpdateGalleryImageInput = await request.json();

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.image !== undefined) updateData.image = body.image;
    if (body.category !== undefined) {
      updateData.category = body.category;
      updateData.categoryEn = body.categoryEn ?? body.category;
    }
    if (body.categoryEn !== undefined) updateData.categoryEn = body.categoryEn;
    if (body.categoryAr !== undefined) updateData.categoryAr = body.categoryAr;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const result = await galleryCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 }
      );
    }

    const updatedImage = await galleryCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      data: updatedImage,
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      { error: "Failed to update gallery image" },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery/[id] - Delete a gallery image (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    await requireAdmin();

    const { id } = await params;
    const galleryCollection = await getGalleryCollection();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid gallery image ID" },
        { status: 400 }
      );
    }

    const result = await galleryCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Gallery image not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}
