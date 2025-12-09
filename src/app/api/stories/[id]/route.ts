import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getStoriesCollection } from "../../../../../lib/db";
import { UpdateStoryInput } from "../../../../../lib/models/Story";
import { requireAdmin } from "../../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../../lib/i18n/serverLocale";

// GET /api/stories/[id] - Get a single story by ID
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
        { error: "Invalid story ID" },
        { status: 400 }
      );
    }

    const storiesCollection = await getStoriesCollection();
    const story = await storiesCollection.findOne({ _id: new ObjectId(id) });

    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    const namesEn = story.namesEn ?? story.names ?? "";
    const testimonialEn = story.testimonialEn ?? story.testimonial ?? "";
    const namesAr = story.namesAr ?? null;
    const testimonialAr = story.testimonialAr ?? null;

    // Strip legacy "order" field if present
    const { order: _order, ...safeStory } = story as any;

    return NextResponse.json({
      success: true,
      data: {
        ...safeStory,
        names: pickLocalizedString(locale, { en: namesEn, ar: namesAr }),
        testimonial: pickLocalizedString(locale, { en: testimonialEn, ar: testimonialAr }),
        namesEn,
        namesAr: namesAr ?? "",
        testimonialEn,
        testimonialAr: testimonialAr ?? "",
      },
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}

// PUT /api/stories/[id] - Update a story (Admin only)
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
        { error: "Invalid story ID" },
        { status: 400 }
      );
    }

    const body: UpdateStoryInput = await request.json();
    const storiesCollection = await getStoriesCollection();

    // Check if story exists
    const existingStory = await storiesCollection.findOne({ _id: new ObjectId(id) });
    if (!existingStory) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.image !== undefined) updateData.image = body.image;
    if (body.names !== undefined) updateData.names = body.names;
    if (body.namesEn !== undefined) updateData.namesEn = body.namesEn;
    if (body.namesAr !== undefined) updateData.namesAr = body.namesAr;
    if (body.testimonial !== undefined) updateData.testimonial = body.testimonial;
    if (body.testimonialEn !== undefined) updateData.testimonialEn = body.testimonialEn;
    if (body.testimonialAr !== undefined) updateData.testimonialAr = body.testimonialAr;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    // Update story
    const result = await storiesCollection.findOneAndUpdate(
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
    console.error("Error updating story:", error);
    return NextResponse.json(
      { error: "Failed to update story" },
      { status: 500 }
    );
  }
}

// DELETE /api/stories/[id] - Delete a story (Admin only)
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
        { error: "Invalid story ID" },
        { status: 400 }
      );
    }

    const storiesCollection = await getStoriesCollection();

    // Check if story exists
    const existingStory = await storiesCollection.findOne({ _id: new ObjectId(id) });
    if (!existingStory) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    // Delete story
    await storiesCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error deleting story:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}

