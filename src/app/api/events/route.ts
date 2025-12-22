import { NextRequest, NextResponse } from "next/server";
import { getEventsCollection } from "../../../../lib/db";
import { CreateEventInput } from "../../../../lib/models/Event";
import { requireAdmin } from "../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../lib/i18n/serverLocale";

// GET /api/events - Get all individual events (not event types)
export async function GET(request: NextRequest) {
  try {
    const eventsCollection = await getEventsCollection();
    const locale = getPreferredLocale(request);
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";
    const includeEventTypes = searchParams.get("includeEventTypes") === "true";
    
    // Build query
    let query: any = {};
    if (activeOnly) {
      query.isActive = true;
    }
    // By default, exclude event types (only return individual events)
    // Admin can override with includeEventTypes=true to get everything
    if (!includeEventTypes) {
      query.isEventType = { $ne: true };
    }
    
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
      const typeEn = event.type ?? null;
      const typeAr = event.typeAr ?? null;
      const themeEn = event.theme ?? null;
      const themeAr = event.themeAr ?? null;
      const sizeEn = event.size ?? null;
      const sizeAr = event.sizeAr ?? null;

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
        // Localize type, theme, and size
        type: typeEn ? pickLocalizedString(locale, { en: typeEn, ar: typeAr }) : null,
        typeAr: typeAr ?? "",
        theme: themeEn ? pickLocalizedString(locale, { en: themeEn, ar: themeAr }) : null,
        themeAr: themeAr ?? "",
        size: sizeEn ? pickLocalizedString(locale, { en: sizeEn, ar: sizeAr }) : null,
        sizeAr: sizeAr ?? "",
        // Keep EN values for filtering
        typeEn: typeEn,
        themeEn: themeEn,
        sizeEn: sizeEn,
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
    const subtitleEn = body.eventSubtitleEn ?? body.eventSubtitle ?? titleEn; // Default to title if no subtitle
    const subtitleAr = body.eventSubtitleAr ?? body.eventTitleAr; // Default to titleAr if no subtitleAr
    
    // Validate required fields
    if (
      !body.image ||
      !titleEn ||
      !body.eventTitleAr
    ) {
      return NextResponse.json(
        { error: "Image, English title and Arabic title are required" },
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
      eventSubtitleAr: subtitleAr,
      eventType: body.eventType || null,
      type: body.type || null,
      typeAr: body.typeAr || null,
      theme: body.theme || null,
      themeAr: body.themeAr || null,
      size: body.size || null,
      sizeAr: body.sizeAr || null,
      isEventType: body.isEventType !== undefined ? body.isEventType : false,
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

