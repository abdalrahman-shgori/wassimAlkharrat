"use client";

import AdminCRUDPage, { AdminCRUDConfig } from "@/components/admin/AdminCRUDPage";
import { GalleryCategory } from "../../../../../lib/models/GalleryCategory";

// Form data type with _id as string for AdminCRUDPage compatibility
type GalleryCategoryFormData = Omit<GalleryCategory, '_id'> & {
  _id: string;
};

const generateKey = (nameEn: string) => {
  return nameEn
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const galleryCategoriesConfig: AdminCRUDConfig<GalleryCategoryFormData> = {
  apiEndpoint: "/api/gallery-categories",
  uploadEndpoint: "", // Not needed for categories
  entityName: "Gallery Category",
  entityNamePlural: "Gallery Categories",
  title: "Gallery Categories Management",
  description: "Manage gallery filter categories. These categories will appear as filter options in the gallery page.",
  addButtonText: "Add Gallery Category",
  imageMaxSize: 10,
  imageRequired: false,
  initialFormData: {
    _id: "",
    key: "",
    nameEn: "",
    nameAr: "",
    order: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  formFields: [
    {
      name: "nameEn",
      label: "Category Name (English)",
      type: "text",
      placeholder: "e.g., Weddings",
      required: true,
      helpText: "English name for the category",
    },
    {
      name: "nameAr",
      label: "Category Name (Arabic)",
      type: "text",
      placeholder: "مثال: أعراس",
      required: true,
      helpText: "Arabic name for the category",
    },
    {
      name: "key",
      label: "Category Key",
      type: "text",
      placeholder: "e.g., weddings",
      required: true,
      helpText: "Unique identifier (lowercase, no spaces). Will be auto-generated from English name if left empty.",
      generateSlug: generateKey,
    },
    {
      name: "order",
      label: "Display Order",
      type: "number",
      placeholder: "0",
      helpText: "Order in which categories appear (lower numbers first)",
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
      helpText: "Show this category in filters",
    },
  ],
  renderCardContent: (item: GalleryCategoryFormData) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div>
        <strong>Key:</strong> {item.key}
      </div>
      <div>
        <strong>Name (EN):</strong> {item.nameEn}
      </div>
      {item.nameAr && (
        <div>
          <strong>Name (AR):</strong> {item.nameAr}
        </div>
      )}
      <div>
        <strong>Order:</strong> {item.order ?? 0}
      </div>
      <div>
        <strong>Status:</strong> {item.isActive ? "Active" : "Inactive"}
      </div>
    </div>
  ),
  getName: (item: GalleryCategoryFormData) => item.nameEn || item.key || "Gallery Category",
};

export default function GalleryCategoriesAdminPage() {
  return <AdminCRUDPage config={galleryCategoriesConfig} />;
}
