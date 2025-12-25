"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import AdminCRUDPage, { AdminCRUDConfig } from "@/components/admin/AdminCRUDPage";
import CustomServicesField, { CustomService } from "@/components/admin/CustomServicesField";
import styles from "./page.module.scss";

interface Event {
  _id: string;
  image: string;
  eventTitle: string;
  eventTitleEn: string;
  eventTitleAr: string;
  eventSubtitle?: string;
  eventSubtitleEn?: string;
  eventSubtitleAr?: string;
  eventType?: string;
  type?: string;
  typeAr?: string;
  theme?: string;
  themeAr?: string;
  size?: string;
  sizeAr?: string;
  place?: string;
  placeAr?: string;
  servicesUsed?: Array<{ nameEn: string; nameAr: string }>;
  eventDate?: string;
  isActive: boolean;
}

export default function EventsPage() {
  const [eventTypeOptions, setEventTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  const fetchEventTypes = async () => {
    try {
      const response = await fetch("/api/events/types");
      const data = await response.json();
      if (data.success && data.data) {
        setEventTypeOptions(data.data);
      }
    } catch (error) {
      console.error("Error fetching event types:", error);
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const config: AdminCRUDConfig<Event> = {
    apiEndpoint: "/api/events",
    uploadEndpoint: "/api/events/upload",
    entityName: "Event",
    entityNamePlural: "Events",
    title: "Events Management",
    description: "Manage individual events. Select an event type to categorize each event.",
    addButtonText: "➕ Add New Event",
    imageMaxSize: 10,
    imageRequired: true,
    initialFormData: {
      _id: "",
      image: "",
      eventTitle: "",
      eventTitleEn: "",
      eventTitleAr: "",
      eventType: "",
      type: "",
      typeAr: "",
      theme: "",
      themeAr: "",
      size: "",
      sizeAr: "",
      place: "",
      placeAr: "",
      servicesUsed: [] as CustomService[],
      eventDate: "",
      isActive: true,
    },
    formFields: [
      {
        name: "image",
        label: "Event Image",
        type: "image",
        required: true,
      },
      {
        name: "eventTitleEn",
        label: "Event Title (EN)",
        type: "text",
        placeholder: "e.g., John's 30th Birthday Party",
        required: true,
      },
      {
        name: "eventTitleAr",
        label: "Event Title (AR)",
        type: "text",
        placeholder: "مثال: حفلة عيد ميلاد جون الثلاثين",
        required: true,
      },
      {
        name: "eventType",
        label: "Event Type",
        type: "select",
        placeholder: loadingTypes ? "Loading event types..." : "Select an event type",
        required: true,
        helpText: "Select the event type category for this event. Event types are managed in the Event Types section.",
        options: eventTypeOptions,
      },
      {
        name: "type",
        label: "Type (EN)",
        type: "text",
        placeholder: "e.g., Baby Birthday, Adult Birthday, Kids Party",
        helpText: "Enter the specific type for this event (e.g., Baby Birthday, Adult Birthday). This will be used for filtering on the event detail page.",
      },
      {
        name: "typeAr",
        label: "Type (AR)",
        type: "text",
        placeholder: "مثال: عيد ميلاد طفل، عيد ميلاد بالغ، حفلة أطفال",
        helpText: "أدخل النوع المحدد لهذا الحدث بالعربية. سيتم استخدامه للتصفية في صفحة تفاصيل الحدث.",
      },
      {
        name: "theme",
        label: "Theme (EN)",
        type: "text",
        placeholder: "e.g., Modern, Classic, Rustic, Elegant",
        helpText: "Enter the theme for this event. This will be used for filtering on the event detail page.",
      },
      {
        name: "themeAr",
        label: "Theme (AR)",
        type: "text",
        placeholder: "مثال: عصري، كلاسيكي، ريفي، أنيق",
        helpText: "أدخل موضوع هذا الحدث بالعربية. سيتم استخدامه للتصفية في صفحة تفاصيل الحدث.",
      },
      {
        name: "size",
        label: "Size (EN)",
        type: "select",
        placeholder: "Select size",
        helpText: "Select the size for this event. This will be used for filtering on the event detail page.",
        options: [
          { value: "Small", label: "Small" },
          { value: "Medium", label: "Medium" },
          { value: "Large", label: "Large" },
        ],
      },
      {
        name: "sizeAr",
        label: "Size (AR)",
        type: "select",
        placeholder: "اختر الحجم",
        helpText: "اختر حجم هذا الحدث بالعربية. سيتم استخدامه للتصفية في صفحة تفاصيل الحدث.",
        options: [
          { value: "صغير", label: "صغير" },
          { value: "متوسط", label: "متوسط" },
          { value: "كبير", label: "كبير" },
        ],
      },
      {
        name: "place",
        label: "Place/Location (EN)",
        type: "text",
        placeholder: "e.g., Dama Rose Hotel, Four Seasons, Sheraton Damascus",
        helpText: "Enter the place/location for this event. Users can search by place name.",
      },
      {
        name: "placeAr",
        label: "Place/Location (AR)",
        type: "text",
        placeholder: "مثال: فندق داما روز، فور سيزونز، شيراتون دمشق",
        helpText: "أدخل المكان/الموقع لهذا الحدث بالعربية. يمكن للمستخدمين البحث بإسم المكان.",
      },
      {
        name: "eventDate",
        label: "Event Date",
        type: "custom",
        customRender: (value, onChange) => {
          // Convert date to YYYY-MM-DD format for input[type="date"]
          let dateValue = "";
          if (value) {
            if (typeof value === "string") {
              // Try to parse DD/MM/YYYY format
              const ddmmyyyy = value.match(/(\d{2})\/(\d{2})\/(\d{4})/);
              if (ddmmyyyy) {
                const [, day, month, year] = ddmmyyyy;
                dateValue = `${year}-${month}-${day}`;
              } else if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
                dateValue = value.substring(0, 10);
              } else {
                // Try to parse Date object or ISO string
                try {
                  const date = new Date(value);
                  if (!isNaN(date.getTime())) {
                    dateValue = date.toISOString().split("T")[0];
                  }
                } catch {
                  dateValue = "";
                }
              }
            } else if (value instanceof Date) {
              dateValue = value.toISOString().split("T")[0];
            }
          }
          return (
            <div>
              <label>Event Date *</label>
              <input
                type="date"
                value={dateValue}
                onChange={(e) => {
                  onChange(e.target.value || "");
                }}
                style={{ width: "100%", padding: "8px", marginTop: "8px" }}
              />
              <small>Enter the date when the event occurred or will occur</small>
            </div>
          );
        },
        helpText: "Select the date when the event occurred or will occur",
      },
      {
        name: "servicesUsed",
        label: "Services Used",
        type: "custom",
        customRender: (value, onChange) => {
          const services = Array.isArray(value) ? value : [];
          return (
            <CustomServicesField
              services={services}
              onChange={onChange}
            />
          );
        },
        helpText: "Add custom services used for this event. Click the + button to add a new service with English and Arabic names.",
      },
      {
        name: "isActive",
        label: "Active (visible to public)",
        type: "checkbox",
      },
    ],
    validateForm: (formData) => {
      if (!formData.image) return "Event image is required";
      if (!formData.eventTitleEn) return "Event title (EN) is required";
      if (!formData.eventTitleAr) return "Event title (AR) is required";
      if (!formData.eventType) return "Event type is required";

      // Keep derived fields in sync for display/API fallbacks
      formData.eventTitle = formData.eventTitleEn;
      // Set default subtitle if not provided
      formData.eventSubtitle = formData.eventTitleEn;
      formData.eventSubtitleEn = formData.eventTitleEn;
      formData.eventSubtitleAr = formData.eventTitleAr;
      // Ensure this is NOT an event type
      (formData as any).isEventType = false;
      return null;
    },
    renderCardContent: (event) => (
      <>
        <h3 className={styles.eventTitle}>{event.eventTitle}</h3>
        {event.eventType && (
          <p className={styles.eventSubtitle}>Event Type: {event.eventType}</p>
        )}
        <div className={styles.eventDetails}>
          {event.type && (
            <span className={styles.eventDetail}>Type: {event.type}</span>
          )}
          {event.theme && (
            <span className={styles.eventDetail}>Theme: {event.theme}</span>
          )}
          {event.size && (
            <span className={styles.eventDetail}>Size: {event.size}</span>
          )}
          {event.place && (
            <span className={styles.eventDetail}>📍 {event.place}</span>
          )}
        </div>
      </>
    ),
    getName: (event) => event.eventTitle,
  };

  return <AdminCRUDPage config={config} />;
}
