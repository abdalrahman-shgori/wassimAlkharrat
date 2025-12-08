"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";
import AdminCard from "./AdminCard";
import styles from "./admin.module.scss";

export interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "image" | "icon" | "slug";
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  helpText?: string;
  generateSlug?: (value: string) => string;
}

export interface AdminCRUDConfig<T = any> {
  // API endpoints
  apiEndpoint: string;
  uploadEndpoint: string;
  entityName: string; // "Service", "Event", "Story"
  entityNamePlural: string; // "Services", "Events", "Stories"
  
  // Display
  title: string;
  description: string;
  addButtonText: string;
  
  // Form configuration
  formFields: FormField[];
  initialFormData: T;
  
  // Image upload config
  imageMaxSize?: number; // in MB
  imageRequired?: boolean;
  
  // Custom renderers
  renderCardContent: (item: T) => React.ReactNode;
  getName: (item: T) => string;
  
  // Custom validation
  validateForm?: (formData: T) => string | null; // Returns error message or null
}

export default function AdminCRUDPage<T extends { _id: string; image?: string; isActive: boolean; order: number }>({
  config,
}: {
  config: AdminCRUDConfig<T>;
}) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formData, setFormData] = useState<T>(config.initialFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(config.apiEndpoint);
      const data = await response.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error(`Error fetching ${config.entityNamePlural.toLowerCase()}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: T) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
      setImagePreview((item as any).image || null);
    } else {
      setEditingItem(null);
      setFormData(config.initialFormData);
      setImagePreview(null);
    }
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setImagePreview(null);
    setError("");
    setSuccess("");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    const maxSize = (config.imageMaxSize || 5) * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size exceeds ${config.imageMaxSize || 5}MB limit.`);
      return;
    }

    try {
      setUploadingImage(true);
      setError("");

      const formDataToSend = new FormData();
      formDataToSend.append("image", file);

      const response = await fetch(config.uploadEndpoint, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData((prev: any) => ({ ...prev, image: data.imageUrl }));
        setImagePreview(data.imageUrl);
        setSuccess("Image uploaded successfully!");
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError(data.error || "Failed to upload image");
      }
    } catch (error) {
      setError("An error occurred while uploading the image");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev: any) => ({ ...prev, image: "" }));
    setImagePreview(null);
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    const field = config.formFields.find((f) => f.name === fieldName);
    
    if (field?.type === "slug" && field.generateSlug) {
      // Auto-generate slug from another field
      const sourceField = config.formFields.find((f) => f.generateSlug);
      if (sourceField && field.generateSlug) {
        setFormData((prev: any) => ({
          ...prev,
          [fieldName]: field.generateSlug!(value),
        }));
      }
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Custom validation
    if (config.validateForm) {
      const validationError = config.validateForm(formData);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    try {
      const url = editingItem
        ? `${config.apiEndpoint}/${editingItem._id}`
        : config.apiEndpoint;
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          editingItem
            ? `${config.entityName} updated successfully!`
            : `${config.entityName} created successfully!`
        );
        fetchItems();
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } else {
        setError(data.error || `Failed to save ${config.entityName.toLowerCase()}`);
      }
    } catch (error) {
      setError("An error occurred");
      console.error(error);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${config.apiEndpoint}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess(`${config.entityName} deleted successfully!`);
        fetchItems();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || `Failed to delete ${config.entityName.toLowerCase()}`);
      }
    } catch (error) {
      setError("An error occurred");
      console.error(error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{config.title}</h1>
          <p className={styles.description}>{config.description}</p>
        </div>
        <button onClick={() => handleOpenModal()} className={styles.addBtn}>
          {config.addButtonText}
        </button>
      </div>

      {(error || success) && (
        <div className={error ? styles.errorBanner : styles.successBanner}>
          {error || success}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading {config.entityNamePlural.toLowerCase()}...</div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <AdminCard
              key={item._id}
              item={item}
              renderContent={config.renderCardContent}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              getName={config.getName}
            />
          ))}

          {items.length === 0 && (
            <div className={styles.empty}>
              <p>No {config.entityNamePlural.toLowerCase()} found. Create your first {config.entityName.toLowerCase()}!</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>
                {editingItem ? `Edit ${config.entityName}` : `Add New ${config.entityName}`}
              </h2>
              <button
                onClick={handleCloseModal}
                className={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}
              {success && <div className={styles.success}>{success}</div>}

              {config.formFields.map((field) => {
                if (field.type === "image") {
                  return (
                    <div key={field.name} className={styles.formGroup}>
                      <label>
                        {field.label} {field.required && "*"}
                      </label>
                      <ImageUpload
                        imageUrl={(formData as any).image || ""}
                        imagePreview={imagePreview}
                        uploadingImage={uploadingImage}
                        onImageChange={handleImageUpload}
                        onRemoveImage={handleRemoveImage}
                        maxSize={config.imageMaxSize}
                      />
                    </div>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <div key={field.name} className={styles.formGroup}>
                      <label>
                        {field.label} {field.required && "*"}
                      </label>
                      <textarea
                        value={(formData as any)[field.name] || ""}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.required}
                        rows={field.rows || 4}
                        placeholder={field.placeholder}
                      />
                      {field.helpText && <small>{field.helpText}</small>}
                    </div>
                  );
                }

                if (field.type === "checkbox") {
                  return (
                    <div key={field.name} className={styles.formGroup}>
                      <label className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={(formData as any)[field.name] || false}
                          onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                        />
                        <span>{field.label}</span>
                      </label>
                    </div>
                  );
                }

                if (field.type === "number") {
                  return (
                    <div key={field.name} className={styles.formGroup}>
                      <label>
                        {field.label} {field.required && "*"}
                      </label>
                      <input
                        type="number"
                        value={(formData as any)[field.name] || ""}
                        onChange={(e) => handleFieldChange(field.name, parseInt(e.target.value))}
                        required={field.required}
                        min={1}
                        placeholder={field.placeholder}
                      />
                      {field.helpText && <small>{field.helpText}</small>}
                    </div>
                  );
                }

                // Text input (including slug and icon)
                return (
                  <div key={field.name} className={styles.formGroup}>
                    <label>
                      {field.label} {field.required && "*"}
                    </label>
                    <input
                      type="text"
                      value={(formData as any)[field.name] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleFieldChange(field.name, value);
                        
                        // Auto-generate slug if this is the source field
                        if (field.generateSlug) {
                          const slugField = config.formFields.find((f) => f.type === "slug");
                          if (slugField && field.generateSlug) {
                            handleFieldChange(slugField.name, field.generateSlug(value));
                          }
                        }
                      }}
                      required={field.required}
                      placeholder={field.placeholder}
                      maxLength={field.maxLength}
                    />
                    {field.helpText && <small>{field.helpText}</small>}
                  </div>
                );
              })}

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingItem ? `Update ${config.entityName}` : `Create ${config.entityName}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

