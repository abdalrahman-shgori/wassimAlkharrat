"use client";
export const dynamic = "force-dynamic";

import AdminCRUDPage, { AdminCRUDConfig } from "@/components/admin/AdminCRUDPage";
import styles from "../events/page.module.scss";

interface EventType {
  _id: string;
  image: string;
  eventTitle: string;
  eventTitleEn: string;
  eventTitleAr: string;
  eventSubtitle: string;
  eventSubtitleEn: string;
  eventSubtitleAr: string;
  isActive: boolean;
}

const config: AdminCRUDConfig<EventType> = {
  apiEndpoint: "/api/event-types",
  uploadEndpoint: "/api/events/upload",
  entityName: "Event Type",
  entityNamePlural: "Event Types",
  title: "Event Types Management",
  description: "Manage event type categories (e.g., Birthday, Wedding, etc.)",
  addButtonText: "➕ Add New Event Type",
  imageMaxSize: 10,
  imageRequired: true,
  initialFormData: {
    _id: "",
    image: "",
    eventTitle: "",
    eventTitleEn: "",
    eventTitleAr: "",
    eventSubtitle: "",
    eventSubtitleEn: "",
    eventSubtitleAr: "",
    isActive: true,
  },
  formFields: [
    {
      name: "image",
      label: "Event Type Image",
      type: "image",
      required: true,
    },
    {
      name: "eventTitleEn",
      label: "Event Type Title (EN)",
      type: "text",
      placeholder: "e.g., Birthday or Anniversary Celebration",
      required: true,
    },
    {
      name: "eventTitleAr",
      label: "Event Type Title (AR)",
      type: "text",
      placeholder: "مثال: عيد ميلاد أو ذكرى سنوية",
      required: true,
    },
    {
      name: "eventSubtitleEn",
      label: "Event Type Subtitle (EN)",
      type: "text",
      placeholder: "e.g., BIRTHDAY",
      required: true,
    },
    {
      name: "eventSubtitleAr",
      label: "Event Type Subtitle (AR)",
      type: "text",
      placeholder: "مثال: عيد ميلاد",
      required: true,
    },
    {
      name: "isActive",
      label: "Active (visible to public)",
      type: "checkbox",
    },
  ],
  validateForm: (formData) => {
    if (!formData.image) return "Event type image is required";
    if (!formData.eventTitleEn) return "Event type title (EN) is required";
    if (!formData.eventTitleAr) return "Event type title (AR) is required";
    if (!formData.eventSubtitleEn) return "Event type subtitle (EN) is required";
    if (!formData.eventSubtitleAr) return "Event type subtitle (AR) is required";

    // Keep derived fields in sync for display/API fallbacks
    formData.eventTitle = formData.eventTitleEn;
    formData.eventSubtitle = formData.eventSubtitleEn;
    // Mark as event type
    (formData as any).isEventType = true;
    return null;
  },
  renderCardContent: (eventType) => (
    <>
      <h3 className={styles.eventTitle}>{eventType.eventTitle}</h3>
      <p className={styles.eventSubtitle}>{eventType.eventSubtitle}</p>
    </>
  ),
  getName: (eventType) => eventType.eventTitle,
};

export default function EventTypesPage() {
  return <AdminCRUDPage config={config} />;
}

