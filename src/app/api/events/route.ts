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
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;
    
    // Filter parameters
    const eventTypeFilter = searchParams.get("eventType");
    const typeFilter = searchParams.get("type");
    const themeFilter = searchParams.get("theme");
    const sizeFilter = searchParams.get("size");
    const placeSearch = searchParams.get("placeSearch");
    
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
    
    // Apply filters
    if (eventTypeFilter) {
      query.eventType = eventTypeFilter;
    }
    if (typeFilter) {
      query.type = typeFilter;
    }
    if (themeFilter) {
      query.theme = themeFilter;
    }
    if (sizeFilter) {
      query.size = sizeFilter;
    }
    if (placeSearch) {
      // Normalize search term: remove spaces and convert to lowercase
      const normalizedSearch = placeSearch.replace(/\s+/g, '').toLowerCase();
      
      // Search in both EN and AR place fields (case-insensitive, space-insensitive)
      // Using $expr to compare normalized strings
      query.$expr = {
        $or: [
          {
            $regexMatch: {
              input: { 
                $toLower: { 
                  $replaceAll: { 
                    input: { $ifNull: ["$place", ""] }, 
                    find: " ", 
                    replacement: "" 
                  } 
                } 
              },
              regex: normalizedSearch
            }
          },
          {
            $regexMatch: {
              input: { 
                $toLower: { 
                  $replaceAll: { 
                    input: { $ifNull: ["$placeAr", ""] }, 
                    find: " ", 
                    replacement: "" 
                  } 
                } 
              },
              regex: normalizedSearch
            }
          }
        ]
      };
    }
    
    // Get total count for pagination
    const total = await eventsCollection.countDocuments(query);
    
    // Fetch events with pagination
    const events = await eventsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
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
      const placeEn = event.place ?? null;
      const placeAr = event.placeAr ?? null;

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
        // Localize place
        place: placeEn ? pickLocalizedString(locale, { en: placeEn, ar: placeAr }) : null,
        placeAr: placeAr ?? "",
        // Keep EN values for filtering
        typeEn: typeEn,
        themeEn: themeEn,
        sizeEn: sizeEn,
        placeEn: placeEn,
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
      place: body.place || null,
      placeAr: body.placeAr || null,
      servicesUsed: body.servicesUsed || [],
      eventDate: body.eventDate || null,
      gallery: body.gallery || [],
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

