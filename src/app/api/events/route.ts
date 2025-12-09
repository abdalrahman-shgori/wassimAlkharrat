import { NextRequest, NextResponse } from "next/server";
import { getEventsCollection } from "../../../../lib/db";
import { CreateEventInput } from "../../../../lib/models/Event";
import { requireAdmin } from "../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../lib/i18n/serverLocale";

// GET /api/events - Get all events
export async function GET(request: NextRequest) {
  try {
    const eventsCollection = await getEventsCollection();
    const locale = getPreferredLocale(request);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    
    // Build query
    const query = activeOnly ? { isActive: true } : {};
    
    // Fetch events sorted by newest first
    const events = await eventsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const localized = events.map((event) => {
      const titleEn = event.eventTitleEn ?? event.eventTitle ?? "";
      const subtitleEn = event.eventSubtitleEn ?? event.eventSubtitle ?? "";
      const titleAr = event.eventTitleAr ?? null;
      const subtitleAr = event.eventSubtitleAr ?? null;

      // Strip legacy "order" field if it exists
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { order: _order, ...rest } = event as any;

      return {
        ...rest,
        eventTitle: pickLocalizedString(locale, { en: titleEn, ar: titleAr }),
        eventSubtitle: pickLocalizedString(locale, { en: subtitleEn, ar: subtitleAr }),
        eventTitleEn: titleEn,
        eventTitleAr: titleAr ?? "",
        eventSubtitleEn: subtitleEn,
        eventSubtitleAr: subtitleAr ?? "",
      };
    });

    return NextResponse.json({
      success: true,
      data: localized,
      count: localized.length,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const body: CreateEventInput = await request.json();
    const titleEn = body.eventTitleEn ?? body.eventTitle;
    const subtitleEn = body.eventSubtitleEn ?? body.eventSubtitle;
    
    // Validate required fields
    if (
      !body.image ||
      !titleEn ||
      !subtitleEn ||
      !body.eventTitleAr ||
      !body.eventSubtitleAr
    ) {
      return NextResponse.json(
        { error: "Image, English/Arabic title and English/Arabic subtitle are required" },
        { status: 400 }
      );
    }

    const eventsCollection = await getEventsCollection();

    // Create new event
    const newEvent: any = {
      image: body.image,
      eventTitle: titleEn,
      eventTitleEn: titleEn,
      eventTitleAr: body.eventTitleAr,
      eventSubtitle: subtitleEn,
      eventSubtitleEn: subtitleEn,
      eventSubtitleAr: body.eventSubtitleAr,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await eventsCollection.insertOne(newEvent);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newEvent },
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

