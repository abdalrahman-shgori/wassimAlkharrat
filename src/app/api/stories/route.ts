import { NextRequest, NextResponse } from "next/server";
import { getStoriesCollection } from "../../../../lib/db";
import { CreateStoryInput } from "../../../../lib/models/Story";
import { requireAdmin } from "../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../lib/i18n/serverLocale";

// GET /api/stories - Get all stories
export async function GET(request: NextRequest) {
  try {
    const storiesCollection = await getStoriesCollection();
    const locale = getPreferredLocale(request);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    
    // Build query
    const query = activeOnly ? { isActive: true } : {};
    
    // Fetch stories sorted by order
    const stories = await storiesCollection
      .find(query)
      .sort({ order: 1 })
      .toArray();

    const localized = stories.map((story) => {
      const namesEn = story.namesEn ?? story.names ?? "";
      const testimonialEn = story.testimonialEn ?? story.testimonial ?? "";
      const namesAr = story.namesAr ?? null;
      const testimonialAr = story.testimonialAr ?? null;

      return {
        ...story,
        names: pickLocalizedString(locale, { en: namesEn, ar: namesAr }),
        testimonial: pickLocalizedString(locale, { en: testimonialEn, ar: testimonialAr }),
        namesEn,
        namesAr: namesAr ?? "",
        testimonialEn,
        testimonialAr: testimonialAr ?? "",
      };
    });

    return NextResponse.json({
      success: true,
      data: localized,
      count: localized.length,
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

// POST /api/stories - Create a new story (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const body: CreateStoryInput = await request.json();
    const namesEn = body.namesEn ?? body.names;
    const testimonialEn = body.testimonialEn ?? body.testimonial;
    
    // Validate required fields
    if (
      !body.image ||
      !namesEn ||
      !testimonialEn ||
      !body.namesAr ||
      !body.testimonialAr
    ) {
      return NextResponse.json(
        { error: "Image, English/Arabic names and English/Arabic testimonial are required" },
        { status: 400 }
      );
    }

    const storiesCollection = await getStoriesCollection();
    
    // Get the highest order number
    const lastStory = await storiesCollection
      .find()
      .sort({ order: -1 })
      .limit(1)
      .toArray();
    
    const nextOrder = lastStory.length > 0 ? (lastStory[0].order || 0) + 1 : 1;

    // Create new story
    const newStory: any = {
      image: body.image,
      names: namesEn,
      namesEn,
      namesAr: body.namesAr,
      testimonial: testimonialEn,
      testimonialEn,
      testimonialAr: body.testimonialAr,
      isActive: body.isActive !== undefined ? body.isActive : true,
      order: body.order !== undefined ? body.order : nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await storiesCollection.insertOne(newStory);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newStory },
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error creating story:", error);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}

