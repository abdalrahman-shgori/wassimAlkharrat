"use client";
export const dynamic = "force-dynamic";

import AdminCRUDPage, { AdminCRUDConfig } from "@/components/admin/AdminCRUDPage";
import styles from "./page.module.scss";

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  isActive: boolean;
  order: number;
}

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const config: AdminCRUDConfig<Service> = {
  apiEndpoint: "/api/services",
  uploadEndpoint: "/api/services/upload",
  entityName: "Service",
  entityNamePlural: "Services",
  title: "Services Management",
  description: "Manage your event planning services",
  addButtonText: "➕ Add New Service",
  imageMaxSize: 5,
  imageRequired: false,
  initialFormData: {
    _id: "",
    name: "",
    slug: "",
    description: "",
    icon: "🎉",
    image: "",
    isActive: true,
    order: 1,
  },
  formFields: [
    {
      name: "name",
      label: "Service Name",
      type: "text",
      placeholder: "e.g., Weddings",
      required: true,
      generateSlug,
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
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Describe your service...",
      required: true,
      rows: 4,
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
  renderCardContent: (service) => (
    <>
      <h3 className={styles.serviceName}>{service.name}</h3>
      <p className={styles.slug}>{service.slug}</p>
      <p className={styles.serviceDescription}>{service.description}</p>
    </>
  ),
  getName: (service) => service.name,
};

export default function ServicesPage() {
  return <AdminCRUDPage config={config} />;
}
