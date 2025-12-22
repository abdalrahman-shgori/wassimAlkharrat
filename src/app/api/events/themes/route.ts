import { NextRequest, NextResponse } from "next/server";
import { getEventsCollection } from "../../../../../lib/db";

// GET /api/events/themes - Get unique event themes
export async function GET(request: NextRequest) {
  try {
    const eventsCollection = await getEventsCollection();
    
    // Get all active events with themes
    const events = await eventsCollection
      .find({ isActive: true, theme: { $exists: true, $ne: null, $ne: "" } })
      .toArray();

    // Extract unique themes
    const themesSet = new Set<string>();
    
    events.forEach((event: any) => {
      if (event.theme && typeof event.theme === 'string') {
        themesSet.add(event.theme);
      }
    });

    // Convert to array and sort
    const themes = Array.from(themesSet).sort();

    return NextResponse.json({
      success: true,
      data: themes.map(theme => ({
        value: theme,
        label: theme,
      })),
    });
  } catch (error) {
    console.error("Error fetching event themes:", error);
    return NextResponse.json(
      { error: "Failed to fetch event themes" },
      { status: 500 }
    );
  }
}

