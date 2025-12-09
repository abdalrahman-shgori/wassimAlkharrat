import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getEventsCollection } from "../../../../../lib/db";
import { UpdateEventInput } from "../../../../../lib/models/Event";
import { requireAdmin } from "../../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../../lib/i18n/serverLocale";

// GET /api/events/[id] - Get a single event by ID
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
        { error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const eventsCollection = await getEventsCollection();
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const titleEn = event.eventTitleEn ?? event.eventTitle ?? "";
    const subtitleEn = event.eventSubtitleEn ?? event.eventSubtitle ?? "";
    const titleAr = event.eventTitleAr ?? null;
    const subtitleAr = event.eventSubtitleAr ?? null;

    // Strip legacy "order" field if present
    const { order: _order, ...safeEvent } = event as any;

    return NextResponse.json({
      success: true,
      data: {
        ...safeEvent,
        eventTitle: pickLocalizedString(locale, { en: titleEn, ar: titleAr }),
        eventSubtitle: pickLocalizedString(locale, { en: subtitleEn, ar: subtitleAr }),
        eventTitleEn: titleEn,
        eventTitleAr: titleAr ?? "",
        eventSubtitleEn: subtitleEn,
        eventSubtitleAr: subtitleAr ?? "",
      },
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update an event (Admin only)
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
        { error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const body: UpdateEventInput = await request.json();
    const eventsCollection = await getEventsCollection();

    // Check if event exists
    const existingEvent = await eventsCollection.findOne({ _id: new ObjectId(id) });
    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.image !== undefined) updateData.image = body.image;
    if (body.eventTitle !== undefined) updateData.eventTitle = body.eventTitle;
    if (body.eventTitleEn !== undefined) updateData.eventTitleEn = body.eventTitleEn;
    if (body.eventTitleAr !== undefined) updateData.eventTitleAr = body.eventTitleAr;
    if (body.eventSubtitle !== undefined) updateData.eventSubtitle = body.eventSubtitle;
    if (body.eventSubtitleEn !== undefined) updateData.eventSubtitleEn = body.eventSubtitleEn;
    if (body.eventSubtitleAr !== undefined) updateData.eventSubtitleAr = body.eventSubtitleAr;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    // Update event
    const result = await eventsCollection.findOneAndUpdate(
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
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete an event (Admin only)
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
        { error: "Invalid event ID" },
        { status: 400 }
      );
    }

    const eventsCollection = await getEventsCollection();

    // Check if event exists
    const existingEvent = await eventsCollection.findOne({ _id: new ObjectId(id) });
    if (!existingEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Delete event
    await eventsCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

