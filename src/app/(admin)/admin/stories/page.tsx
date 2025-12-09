"use client";
export const dynamic = "force-dynamic";

import AdminCRUDPage, { AdminCRUDConfig } from "@/components/admin/AdminCRUDPage";
import styles from "./page.module.scss";

interface Story {
  _id: string;
  image: string;
  names: string;
  namesEn: string;
  namesAr: string;
  testimonial: string;
  testimonialEn: string;
  testimonialAr: string;
  isActive: boolean;
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
    namesEn: "",
    namesAr: "",
    testimonial: "",
    testimonialEn: "",
    testimonialAr: "",
    isActive: true,
  },
  formFields: [
    {
      name: "image",
      label: "Story Image",
      type: "image",
      required: true,
    },
    {
      name: "namesEn",
      label: "Names (EN)",
      type: "text",
      placeholder: "e.g., Chris & Elena",
      required: true,
      helpText: "Names of the people in the story",
    },
    {
      name: "namesAr",
      label: "Names (AR)",
      type: "text",
      placeholder: "مثال: كريس وإيلينا",
      required: true,
      helpText: "Names of the people in the story (Arabic)",
    },
    {
      name: "testimonialEn",
      label: "Testimonial (EN)",
      type: "textarea",
      placeholder: "Enter the testimonial text...",
      required: true,
      rows: 6,
    },
    {
      name: "testimonialAr",
      label: "Testimonial (AR)",
      type: "textarea",
      placeholder: "أدخل نص الشهادة...",
      required: true,
      rows: 6,
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
