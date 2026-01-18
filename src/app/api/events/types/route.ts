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

    // Create a map to store unique event types with both EN and AR
    const eventTypesMap = new Map<string, { en: string; ar: string | null }>();
    
    eventTypeDocs.forEach((event: any) => {
      const eventTitleEn = event.eventTitleEn || event.eventTitle;
      const eventTitleAr = event.eventTitleAr || null;
      
      if (eventTitleEn && typeof eventTitleEn === 'string') {
        // Use English title as the key to ensure uniqueness
        if (!eventTypesMap.has(eventTitleEn)) {
          eventTypesMap.set(eventTitleEn, {
            en: eventTitleEn,
            ar: eventTitleAr,
          });
        }
      }
    });

    // Convert to array, sort by English title, and format labels
    const eventTypes = Array.from(eventTypesMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([enTitle, { en, ar }]) => {
        // Format label: "English (Arabic)" or just "English" if no Arabic
        const label = ar ? `${en} (${ar})` : en;
        
        return {
          value: en, // Keep English as the value for consistency
          label: label,
        };
      });

    return NextResponse.json({
      success: true,
      data: eventTypes,
    });
  } catch (error) {
    console.error("Error fetching event types:", error);
    return NextResponse.json(
      { error: "Failed to fetch event types" },
      { status: 500 }
    );
  }
}

