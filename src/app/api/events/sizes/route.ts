import { NextRequest, NextResponse } from "next/server";
import { getEventsCollection } from "../../../../../lib/db";

// GET /api/events/sizes - Get unique event sizes
export async function GET(request: NextRequest) {
  try {
    const eventsCollection = await getEventsCollection();
    
    // Get all active events with sizes
    const events = await eventsCollection
      .find({ 
        isActive: true, 
        size: { 
          $exists: true,
          $nin: [null, ""] as any
        }
      } as any)
      .toArray();

    // Extract unique sizes
    const sizesSet = new Set<string>();
    
    events.forEach((event: any) => {
      if (event.size && typeof event.size === 'string') {
        sizesSet.add(event.size);
      }
    });

    // Convert to array and sort
    const sizes = Array.from(sizesSet).sort();

    return NextResponse.json({
      success: true,
      data: sizes.map(size => ({
        value: size,
        label: size,
      })),
    });
  } catch (error) {
    console.error("Error fetching event sizes:", error);
    return NextResponse.json(
      { error: "Failed to fetch event sizes" },
      { status: 500 }
    );
  }
}

