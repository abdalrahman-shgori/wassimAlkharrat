import { NextRequest, NextResponse } from "next/server";
import { getEventsCollection } from "../../../../../lib/db";

// GET /api/events/types - Get unique event types
export async function GET(request: NextRequest) {
  try {
    const eventsCollection = await getEventsCollection();
    
    // Get all active event types (where isEventType is true)
    const eventTypeDocs = await eventsCollection
      .find({ isActive: true, isEventType: true })
      .toArray();

    // Extract unique event types from eventTitleEn
    const eventTypesSet = new Set<string>();
    
    eventTypeDocs.forEach((event: any) => {
      const eventTitleEn = event.eventTitleEn || event.eventTitle;
      if (eventTitleEn && typeof eventTitleEn === 'string') {
        eventTypesSet.add(eventTitleEn);
      }
    });

    // Convert to array and sort
    const eventTypes = Array.from(eventTypesSet).sort();

    return NextResponse.json({
      success: true,
      data: eventTypes.map(type => ({
        value: type,
        label: type,
      })),
    });
  } catch (error) {
    console.error("Error fetching event types:", error);
    return NextResponse.json(
      { error: "Failed to fetch event types" },
      { status: 500 }
    );
  }
}

