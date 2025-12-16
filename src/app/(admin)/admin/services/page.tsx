"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import AdminCRUDPage, { AdminCRUDConfig } from "@/components/admin/AdminCRUDPage";
import WhatWeDoArrayField, { WhatWeDoItem } from "@/components/admin/WhatWeDoArrayField";
import styles from "./page.module.scss";

interface Service {
  _id: string;
  name: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionEn: string;
  descriptionAr: string;
  title?: string;
  titleEn?: string;
  titleAr?: string;
  details?: string;
  detailsEn?: string;
  detailsAr?: string;
  whatWeDo?: WhatWeDoItem[];
  icon: string;
  image?: string;
  filterKey?: string;
  isActive: boolean;
}

interface ServiceFilter {
  _id: string;
  key: string;
  nameEn: string;
  nameAr: string;
}

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

export default function ServicesPage() {
  const [filterOptions, setFilterOptions] = useState<{ value: string; label: string }[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    // Fetch available filter keys
    const fetchFilters = async () => {
      try {
        const response = await fetch("/api/service-filters");
        const data = await response.json();
        if (data.success && data.data) {
          const options = data.data.map((filter: ServiceFilter) => ({
            value: filter.key,
            label: `${filter.key} (${filter.nameEn})`,
          }));
          setFilterOptions(options);
        }
      } catch (error) {
        console.error("Error fetching service filters:", error);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilters();
  }, []);

  const config: AdminCRUDConfig<Service> = {
  apiEndpoint: "/api/services",
  uploadEndpoint: "/api/services/upload",
  entityName: "Service",
  entityNamePlural: "Services",
  title: "Services Management",
  description: "Manage your event planning services",
  addButtonText: "➕ Add New Service",
  imageMaxSize: 10,
  imageRequired: false,
  initialFormData: {
    _id: "",
    name: "",
    nameEn: "",
    nameAr: "",
    slug: "",
    description: "",
    descriptionEn: "",
    descriptionAr: "",
    title: "",
    titleEn: "",
    titleAr: "",
    details: "",
    detailsEn: "",
    detailsAr: "",
    whatWeDo: [],
    icon: "🎉",
    image: "",
    filterKey: "",
    isActive: true,
  },
  formFields: [
    {
      name: "nameEn",
      label: "Service Name (EN)",
      type: "text",
      placeholder: "e.g., Weddings",
      required: true,
      generateSlug,
    },
    {
      name: "nameAr",
      label: "Service Name (AR)",
      type: "text",
      placeholder: "مثال: حفلات الزفاف",
      required: true,
    },
    {
      name: "slug",
      label: "Slug",
      type: "slug",
      placeholder: "e.g., weddings",
      required: true,
      helpText: "URL-friendly identifier (lowercase, no spaces)",
    },
    {
      name: "descriptionEn",
      label: "Description (EN)",
      type: "textarea",
      placeholder: "Describe your service...",
      required: true,
      rows: 4,
    },
    {
      name: "descriptionAr",
      label: "Description (AR)",
      type: "textarea",
      placeholder: "وصف الخدمة...",
      required: true,
      rows: 4,
    },
    {
      name: "titleEn",
      label: "Service Title (EN)",
      type: "text",
      placeholder: "e.g., Premium Wedding Planning",
      helpText: "Title displayed on the service detail page",
    },
    {
      name: "titleAr",
      label: "Service Title (AR)",
      type: "text",
      placeholder: "مثال: تخطيط حفلات الزفاف المميزة",
      helpText: "العنوان المعروض في صفحة تفاصيل الخدمة",
    },
    {
      name: "detailsEn",
      label: "Service Details (EN)",
      type: "textarea",
      placeholder: "Detailed information about the service...",
      helpText: "Detailed content displayed on the service detail page",
      rows: 6,
    },
    {
      name: "detailsAr",
      label: "Service Details (AR)",
      type: "textarea",
      placeholder: "معلومات تفصيلية عن الخدمة...",
      helpText: "المحتوى التفصيلي المعروض في صفحة تفاصيل الخدمة",
      rows: 6,
    },
    {
      name: "image",
      label: "Service Image",
      type: "image",
    },
    {
      name: "icon",
      label: "Icon",
      type: "icon",
      placeholder: "🎉",
      maxLength: 2,
      helpText: "Use an emoji",
    },
    {
      name: "filterKey",
      label: "Filter Key",
      type: "select",
      placeholder: "Select a filter key (optional)",
      helpText: "Assign this service to a filter category",
      options: filterOptions,
    },
    {
      name: "isActive",
      label: "Active (visible to public)",
      type: "checkbox",
    },
    {
      name: "whatWeDo",
      label: "What We Do",
      type: "custom",
      customRender: (value, onChange, formData) => {
        // Ensure we always have an array, even if value is null or undefined
        const items = Array.isArray(value) ? value : [];
        return (
          <WhatWeDoArrayField
            items={items}
            onChange={onChange}
            imageMaxSize={10}
            uploadEndpoint="/api/services/upload"
          />
        );
      },
    },
  ],
  renderCardContent: (service) => (
    <>
      <h3 className={styles.serviceName}>{service.name}</h3>
      <p className={styles.slug}>{service.slug}</p>
      {service.filterKey && (
        <p className={styles.filterKey}>Filter: {service.filterKey}</p>
      )}
      <p className={styles.serviceDescription}>{service.description}</p>
      {service.whatWeDo && service.whatWeDo.length > 0 && (
        <p className={styles.whatWeDoCount}>
          What We Do: {service.whatWeDo.length} item(s)
        </p>
      )}
    </>
  ),
  getName: (service) => service.name,
  };

  if (loadingFilters) {
    return <div>Loading...</div>;
  }

  return <AdminCRUDPage config={config} />;
}
