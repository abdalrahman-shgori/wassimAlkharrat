"use client";
export const dynamic = "force-dynamic";

import AdminCRUDPage, { AdminCRUDConfig } from "@/components/admin/AdminCRUDPage";
import styles from "./page.module.scss";

interface Story {
  _id: string;
  image: string;
  names: string;
  testimonial: string;
  isActive: boolean;
  order: number;
}

const config: AdminCRUDConfig<Story> = {
  apiEndpoint: "/api/stories",
  uploadEndpoint: "/api/stories/upload",
  entityName: "Story",
  entityNamePlural: "Stories",
  title: "Stories Management",
  description: "Manage customer testimonials and stories",
  addButtonText: "➕ Add New Story",
  imageMaxSize: 10,
  imageRequired: true,
  initialFormData: {
    _id: "",
    image: "",
    names: "",
    testimonial: "",
    isActive: true,
    order: 1,
  },
  formFields: [
    {
      name: "image",
      label: "Story Image",
      type: "image",
      required: true,
    },
    {
      name: "names",
      label: "Names",
      type: "text",
      placeholder: "e.g., Chris & Elena",
      required: true,
      helpText: "Names of the people in the story",
    },
    {
      name: "testimonial",
      label: "Testimonial",
      type: "textarea",
      placeholder: "Enter the testimonial text...",
      required: true,
      rows: 6,
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
  renderCardContent: (story) => (
    <>
      <h3 className={styles.storyNames}>{story.names}</h3>
      <p className={styles.storyTestimonial}>{story.testimonial}</p>
    </>
  ),
  getName: (story) => story.names,
};

export default function StoriesPage() {
  return <AdminCRUDPage config={config} />;
}
