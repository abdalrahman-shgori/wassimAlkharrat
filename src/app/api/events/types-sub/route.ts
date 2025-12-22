import { NextRequest, NextResponse } from "next/server";
import { getEventsCollection } from "../../../../../lib/db";

// GET /api/events/types-sub - Get unique event sub-types
export async function GET(request: NextRequest) {
  try {
    const eventsCollection = await getEventsCollection();
    
    // Get all active events with types
    const events = await eventsCollection
      .find({ isActive: true, type: { $exists: true, $ne: null, $ne: "" } })
      .toArray();

    // Extract unique types
    const typesSet = new Set<string>();
    
    events.forEach((event: any) => {
      if (event.type && typeof event.type === 'string') {
        typesSet.add(event.type);
      }
    });

    // Convert to array and sort
    const types = Array.from(typesSet).sort();

    return NextResponse.json({
      success: true,
      data: types.map(type => ({
        value: type,
        label: type,
      })),
    });
  } catch (error) {
    console.error("Error fetching event sub-types:", error);
    return NextResponse.json(
      { error: "Failed to fetch event sub-types" },
      { status: 500 }
    );
  }
}

