import { NextRequest, NextResponse } from "next/server";
import { getEventsCollection } from "../../../../lib/db";
import { CreateEventInput } from "../../../../lib/models/Event";
import { requireAdmin } from "../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../lib/i18n/serverLocale";

// GET /api/event-types - Get all event types (categories only)
export async function GET(request: NextRequest) {
  try {
    const eventsCollection = await getEventsCollection();
    const locale = getPreferredLocale(request);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    
    // Build query - only fetch event types (categories)
    const query: any = { isEventType: true };
    if (activeOnly) {
      query.isActive = true;
    }
    
    // Fetch event types sorted by newest first
    const eventTypes = await eventsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const localized = eventTypes.map((eventType) => {
      const titleEn = eventType.eventTitleEn ?? eventType.eventTitle ?? "";
      const subtitleEn = eventType.eventSubtitleEn ?? eventType.eventSubtitle ?? "";
      const titleAr = eventType.eventTitleAr ?? null;
      const subtitleAr = eventType.eventSubtitleAr ?? null;

      // Strip legacy "order" field if it exists
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { order: _order, ...rest } = eventType as any;

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
    console.error("Error fetching event types:", error);
    return NextResponse.json(
      { error: "Failed to fetch event types" },
      { status: 500 }
    );
  }
}

// POST /api/event-types - Create a new event type (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    await requireAdmin();

    const body: CreateEventInput = await request.json();
    const titleEn = body.eventTitleEn ?? body.eventTitle;
    const subtitleEn = body.eventSubtitleEn ?? body.eventSubtitle ?? titleEn;
    const subtitleAr = body.eventSubtitleAr ?? body.eventTitleAr;
    
    // Validate required fields
    if (!body.image || !titleEn || !body.eventTitleAr) {
      return NextResponse.json(
        { error: "Image, English title and Arabic title are required" },
        { status: 400 }
      );
    }

    const eventsCollection = await getEventsCollection();

    // Create new event type
    const newEventType: any = {
      image: body.image,
      eventTitle: titleEn,
      eventTitleEn: titleEn,
      eventTitleAr: body.eventTitleAr,
      eventSubtitle: subtitleEn,
      eventSubtitleEn: subtitleEn,
      eventSubtitleAr: subtitleAr,
      isEventType: true, // Mark as event type
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await eventsCollection.insertOne(newEventType);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...newEventType },
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error creating event type:", error);
    return NextResponse.json(
      { error: "Failed to create event type" },
      { status: 500 }
    );
  }
}

