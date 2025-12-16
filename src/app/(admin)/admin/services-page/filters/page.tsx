"use client";
export const dynamic = "force-dynamic";

import AdminCRUDPage, { AdminCRUDConfig } from "@/components/admin/AdminCRUDPage";
import styles from "./page.module.scss";

interface ServiceFilter {
  _id: string;
  key: string;
  nameEn: string;
  nameAr: string;
  isActive: boolean;
}

const config: AdminCRUDConfig<ServiceFilter> = {
  apiEndpoint: "/api/service-filters",
  uploadEndpoint: "/api/service-filters/upload", // Not used but required by interface
  entityName: "Service Filter",
  entityNamePlural: "Service Filters",
  title: "Services Filters Management",
  description: "Manage filter keys and names for the services page",
  addButtonText: "➕ Add New Filter",
  imageMaxSize: 10,
  imageRequired: false,
  initialFormData: {
    _id: "",
    key: "",
    nameEn: "",
    nameAr: "",
    isActive: true,
  },
  formFields: [
    {
      name: "key",
      label: "Filter Key",
      type: "text",
      placeholder: "e.g., category, type, location",
      required: true,
      helpText: "Unique identifier for the filter (lowercase, no spaces recommended)",
    },
    {
      name: "nameEn",
      label: "Filter Name (EN)",
      type: "text",
      placeholder: "e.g., Category",
      required: true,
    },
    {
      name: "nameAr",
      label: "Filter Name (AR)",
      type: "text",
      placeholder: "مثال: الفئة",
      required: true,
    },
    {
      name: "isActive",
      label: "Active (visible to public)",
      type: "checkbox",
    },
  ],
  renderCardContent: (filter) => (
    <>
      <h3 className={styles.filterKey}>{filter.key}</h3>
      <p className={styles.filterNameEn}>{filter.nameEn}</p>
      <p className={styles.filterNameAr}>{filter.nameAr}</p>
      <p className={styles.filterStatus}>
        Status: {filter.isActive !== false ? "Active" : "Inactive"}
      </p>
    </>
  ),
  getName: (filter) => filter.key,
};

export default function ServiceFiltersPage() {
  return <AdminCRUDPage config={config} />;
}

