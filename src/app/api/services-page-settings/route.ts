import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/auth";
import { getServicesPageSettingsCollection } from "../../../../lib/db";
import { UpsertServicesPageSettingsInput } from "../../../../lib/models/ServicesPageSettings";

const DEFAULT_HERO_IMAGE = "/images/services/servicesPage.webp";

export async function GET() {
  try {
    const servicesPageSettingsCollection = await getServicesPageSettingsCollection();
    const settings = await servicesPageSettingsCollection.findOne({}, { sort: { updatedAt: -1 } });

    return NextResponse.json({
      success: true,
      data: settings || null,
      defaultHeroImage: DEFAULT_HERO_IMAGE,
    });
  } catch (error) {
    console.error("Error fetching services page settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch services page settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();

    const body: UpsertServicesPageSettingsInput = await request.json();
    if (!body.heroImage || typeof body.heroImage !== "string") {
      return NextResponse.json(
        { error: "Hero image URL is required" },
        { status: 400 }
      );
    }

    const servicesPageSettingsCollection = await getServicesPageSettingsCollection();
    const now = new Date();
    const existing = await servicesPageSettingsCollection.findOne({});

    if (existing?._id) {
      await servicesPageSettingsCollection.updateOne(
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

    const result = await servicesPageSettingsCollection.insertOne(newSettings);

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

    console.error("Error updating services page settings:", error);
    return NextResponse.json(
      { error: "Failed to update services page settings" },
      { status: 500 }
    );
  }
}

