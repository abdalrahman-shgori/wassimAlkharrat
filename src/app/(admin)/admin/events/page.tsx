"use client";
export const dynamic = "force-dynamic";

import AdminCRUDPage, { AdminCRUDConfig } from "@/components/admin/AdminCRUDPage";
import styles from "./page.module.scss";

interface Event {
  _id: string;
  image: string;
  eventTitle: string;
  eventTitleEn: string;
  eventTitleAr: string;
  eventSubtitle: string;
  eventSubtitleEn: string;
  eventSubtitleAr: string;
  isActive: boolean;
  order: number;
}

const config: AdminCRUDConfig<Event> = {
  apiEndpoint: "/api/events",
  uploadEndpoint: "/api/events/upload",
  entityName: "Event",
  entityNamePlural: "Events",
  title: "Events Management",
  description: "Manage your events",
  addButtonText: "➕ Add New Event",
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
    order: 1,
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
      placeholder: "e.g., Birthday or Anniversary Celebration",
      required: true,
    },
    {
      name: "eventTitleAr",
      label: "Event Title (AR)",
      type: "text",
      placeholder: "مثال: عيد ميلاد أو ذكرى سنوية",
      required: true,
    },
    {
      name: "eventSubtitleEn",
      label: "Event Subtitle (EN)",
      type: "text",
      placeholder: "e.g., BIRTHDAY",
      required: true,
    },
    {
      name: "eventSubtitleAr",
      label: "Event Subtitle (AR)",
      type: "text",
      placeholder: "مثال: عيد ميلاد",
      required: true,
    },
    {
      name: "order",
      label: "Order",
      type: "number",
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
    if (!formData.eventSubtitleEn) return "Event subtitle (EN) is required";
    if (!formData.eventSubtitleAr) return "Event subtitle (AR) is required";

    // Keep derived fields in sync for display/API fallbacks
    formData.eventTitle = formData.eventTitleEn;
    formData.eventSubtitle = formData.eventSubtitleEn;
    return null;
  },
  renderCardContent: (event) => (
    <>
      <h3 className={styles.eventTitle}>{event.eventTitle}</h3>
      <p className={styles.eventSubtitle}>{event.eventSubtitle}</p>
    </>
  ),
  getName: (event) => event.eventTitle,
};

export default function EventsPage() {
  return <AdminCRUDPage config={config} />;
}
