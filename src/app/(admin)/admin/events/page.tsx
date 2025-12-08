"use client";
export const dynamic = "force-dynamic";

import AdminCRUDPage, { AdminCRUDConfig } from "@/components/admin/AdminCRUDPage";
import styles from "./page.module.scss";

interface Event {
  _id: string;
  image: string;
  eventTitle: string;
  eventSubtitle: string;
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
    eventSubtitle: "",
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
      name: "eventTitle",
      label: "Event Title",
      type: "text",
      placeholder: "e.g., Birthday or Anniversary Celebration",
      required: true,
    },
    {
      name: "eventSubtitle",
      label: "Event Subtitle",
      type: "text",
      placeholder: "e.g., BIRTHDAY",
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
    if (!formData.eventTitle) return "Event title is required";
    if (!formData.eventSubtitle) return "Event subtitle is required";
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
