import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getEventsCollection } from "../../../../../lib/db";
import { UpdateEventInput } from "../../../../../lib/models/Event";
import { requireAdmin } from "../../../../../lib/auth";
import { getPreferredLocale, pickLocalizedString } from "../../../../../lib/i18n/serverLocale";

// GET /api/event-types/[id] - Get a single event type by ID
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
        { error: "Invalid event type ID" },
        { status: 400 }
      );
    }

    const eventsCollection = await getEventsCollection();
    const eventType = await eventsCollection.findOne({ 
      _id: new ObjectId(id),
      isEventType: true 
    });

    if (!eventType) {
      return NextResponse.json(
        { error: "Event type not found" },
        { status: 404 }
      );
    }

    const titleEn = eventType.eventTitleEn ?? eventType.eventTitle ?? "";
    const subtitleEn = eventType.eventSubtitleEn ?? eventType.eventSubtitle ?? "";
    const titleAr = eventType.eventTitleAr ?? null;
    const subtitleAr = eventType.eventSubtitleAr ?? null;

    const { order: _order, ...rest } = eventType as any;

    return NextResponse.json({
      success: true,
      data: {
        ...rest,
        eventTitle: pickLocalizedString(locale, { en: titleEn, ar: titleAr }),
        eventSubtitle: pickLocalizedString(locale, { en: subtitleEn, ar: subtitleAr }),
        eventTitleEn: titleEn,
        eventTitleAr: titleAr ?? "",
        eventSubtitleEn: subtitleEn,
        eventSubtitleAr: subtitleAr ?? "",
      },
    });
  } catch (error) {
    console.error("Error fetching event type:", error);
    return NextResponse.json(
      { error: "Failed to fetch event type" },
      { status: 500 }
    );
  }
}

// PUT /api/event-types/[id] - Update an event type (Admin only)
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
        { error: "Invalid event type ID" },
        { status: 400 }
      );
    }

    const body: UpdateEventInput = await request.json();
    const eventsCollection = await getEventsCollection();

    // Check if event type exists
    const existingEventType = await eventsCollection.findOne({ 
      _id: new ObjectId(id),
      isEventType: true 
    });
    
    if (!existingEventType) {
      return NextResponse.json(
        { error: "Event type not found" },
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
    
    // Ensure it remains an event type
    updateData.isEventType = true;

    // Update event type
    const result = await eventsCollection.findOneAndUpdate(
      { _id: new ObjectId(id), isEventType: true },
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
    console.error("Error updating event type:", error);
    return NextResponse.json(
      { error: "Failed to update event type" },
      { status: 500 }
    );
  }
}

// DELETE /api/event-types/[id] - Delete an event type (Admin only)
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
        { error: "Invalid event type ID" },
        { status: 400 }
      );
    }

    const eventsCollection = await getEventsCollection();

    // Delete only if it's an event type
    const result = await eventsCollection.deleteOne({ 
      _id: new ObjectId(id),
      isEventType: true 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Event type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event type deleted successfully",
    });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Error deleting event type:", error);
    return NextResponse.json(
      { error: "Failed to delete event type" },
      { status: 500 }
    );
  }
}

