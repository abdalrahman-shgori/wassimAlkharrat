"use client";

import { useState, useEffect } from "react";
import AdminCRUDPage, { AdminCRUDConfig } from "@/components/admin/AdminCRUDPage";
import { GalleryImage } from "../../../../../lib/models/Gallery";

// Form data type with _id as string for AdminCRUDPage compatibility
type GalleryImageFormData = Omit<GalleryImage, '_id'> & {
  _id: string;
};

export default function GalleryAdminPage() {
  const [filterOptions, setFilterOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    // Fetch available categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/gallery-categories?active=true");
        const data = await response.json();
        if (data.success && data.data) {
          const options = data.data.map((cat: any) => ({
            value: cat.key,
            label: `${cat.nameEn} (${cat.nameAr || cat.key})`,
          }));
          setFilterOptions(options);
        }
      } catch (error) {
        console.error("Error fetching gallery categories:", error);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchCategories();
  }, []);

  const galleryConfig: AdminCRUDConfig<GalleryImageFormData> = {
  apiEndpoint: "/api/gallery",
  uploadEndpoint: "/api/gallery/upload",
  entityName: "Gallery Image",
  entityNamePlural: "Gallery Images",
  title: "Gallery Management",
  description: "Manage gallery images. Upload images and assign them to categories (Weddings, Birthdays, Conferences, etc.)",
  addButtonText: "Add Gallery Image",
  imageMaxSize: 10,
  imageRequired: true,
  initialFormData: {
    _id: "",
    image: "",
    category: filterOptions[0]?.value || "",
    categoryEn: "",
    categoryAr: "",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  formFields: [
    {
      name: "image",
      label: "Image",
      type: "image",
      required: true,
      helpText: "Upload a gallery image (max 10MB)",
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: filterOptions,
      helpText: "Select the category for this image",
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
      helpText: "Show this image in the gallery",
    },
  ],
  renderCardContent: (item: GalleryImageFormData) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div>
        <strong>Category:</strong> {item.categoryEn || item.category}
      </div>
      {item.categoryAr && (
        <div>
          <strong>Category (AR):</strong> {item.categoryAr}
        </div>
      )}
      <div>
        <strong>Status:</strong> {item.isActive ? "Active" : "Inactive"}
      </div>
    </div>
  ),
  getName: (item: GalleryImageFormData) => {
    const category = filterOptions.find(opt => opt.value === item.category);
    return category?.label || item.category || "Gallery Image";
  },
  };

  if (loadingFilters) {
    return <div>Loading categories...</div>;
  }

  return <AdminCRUDPage config={galleryConfig} />;
}
