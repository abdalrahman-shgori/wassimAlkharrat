"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "🎉",
    isActive: true,
    order: 1,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/services");
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        slug: service.slug,
        description: service.description,
        icon: service.icon,
        isActive: service.isActive,
        order: service.order,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "🎉",
        isActive: true,
        order: services.length + 1,
      });
    }
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const url = editingService
        ? `/api/services/${editingService._id}`
        : "/api/services";
      const method = editingService ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(
          editingService
            ? "Service updated successfully!"
            : "Service created successfully!"
        );
        fetchServices();
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } else {
        setError(data.error || "Failed to save service");
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
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Service deleted successfully!");
        fetchServices();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete service");
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
          <h1 className={styles.title}>Services Management</h1>
          <p className={styles.description}>
            Manage your event planning services
          </p>
        </div>
        <button onClick={() => handleOpenModal()} className={styles.addBtn}>
          ➕ Add New Service
        </button>
      </div>

      {(error || success) && (
        <div className={error ? styles.errorBanner : styles.successBanner}>
          {error || success}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading services...</div>
      ) : (
        <div className={styles.grid}>
          {services.map((service) => (
            <div key={service._id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.icon}>{service.icon}</div>
                <div className={styles.badge}>
                  {service.isActive ? (
                    <span className={styles.active}>Active</span>
                  ) : (
                    <span className={styles.inactive}>Inactive</span>
                  )}
                </div>
              </div>

              <h3 className={styles.serviceName}>{service.name}</h3>
              <p className={styles.slug}>{service.slug}</p>
              <p className={styles.serviceDescription}>{service.description}</p>

              <div className={styles.meta}>
                <span>Order: {service.order}</span>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={() => handleOpenModal(service)}
                  className={styles.editBtn}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id, service.name)}
                  className={styles.deleteBtn}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}

          {services.length === 0 && (
            <div className={styles.empty}>
              <p>No services found. Create your first service!</p>
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
                {editingService ? "Edit Service" : "Add New Service"}
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

              <div className={styles.formGroup}>
                <label>Service Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                  required
                  placeholder="e.g., Weddings"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  placeholder="e.g., weddings"
                />
                <small>URL-friendly identifier (lowercase, no spaces)</small>
              </div>

              <div className={styles.formGroup}>
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={4}
                  placeholder="Describe your service..."
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    placeholder="🎉"
                    maxLength={2}
                  />
                  <small>Use an emoji</small>
                </div>

                <div className={styles.formGroup}>
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value),
                      })
                    }
                    min={1}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  <span>Active (visible to public)</span>
                </label>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                  {editingService ? "Update Service" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

