import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/auth";
import { getHomepageSettingsCollection } from "../../../../lib/db";
import { UpsertHomepageSettingsInput } from "../../../../lib/models/HomepageSettings";

const DEFAULT_HERO_IMAGE = "/images/homepage/DSC06702.webp";

export async function GET() {
  try {
    const homepageSettingsCollection = await getHomepageSettingsCollection();
    const settings = await homepageSettingsCollection.findOne({}, { sort: { updatedAt: -1 } });

    return NextResponse.json({
      success: true,
      data: settings || null,
      defaultHeroImage: DEFAULT_HERO_IMAGE,
    });
  } catch (error) {
    console.error("Error fetching homepage settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();

    const body: UpsertHomepageSettingsInput = await request.json();
    if (!body.heroImage || typeof body.heroImage !== "string") {
      return NextResponse.json(
        { error: "Hero image URL is required" },
        { status: 400 }
      );
    }

    const homepageSettingsCollection = await getHomepageSettingsCollection();
    const now = new Date();
    const existing = await homepageSettingsCollection.findOne({});

    if (existing?._id) {
      await homepageSettingsCollection.updateOne(
        { _id: existing._id },
        {
          $set: {
            heroImage: body.heroImage,
            updatedAt: now,
          },
        }
      );

      return NextResponse.json({
        success: true,
        data: {
          ...existing,
          heroImage: body.heroImage,
          updatedAt: now,
        },
      });
    }

    const newSettings = {
      heroImage: body.heroImage,
      createdAt: now,
      updatedAt: now,
    };

    const result = await homepageSettingsCollection.insertOne(newSettings);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newSettings },
    });
  } catch (error: any) {
    if (error?.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Error updating homepage settings:", error);
    return NextResponse.json(
      { error: "Failed to update homepage settings" },
      { status: 500 }
    );
  }
}


