"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";
import styles from "./admin.module.scss";

export interface WhatWeDoItem {
  title?: string;
  titleEn?: string;
  titleAr?: string;
  description?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  image?: string;
}

interface WhatWeDoArrayFieldProps {
  items: WhatWeDoItem[];
  onChange: (items: WhatWeDoItem[]) => void;
  imageMaxSize?: number;
  uploadEndpoint: string;
}

export default function WhatWeDoArrayField({
  items,
  onChange,
  imageMaxSize = 10,
  uploadEndpoint,
}: WhatWeDoArrayFieldProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>({});
  const [uploadingImages, setUploadingImages] = useState<{ [key: number]: boolean }>({});

  // Initialize image previews when items change
  useEffect(() => {
    if (items && items.length > 0) {
      const previews: { [key: number]: string } = {};
      items.forEach((item, index) => {
        if (item.image) {
          previews[index] = item.image;
        }
      });
      setImagePreviews(previews);
    }
  }, [items]);

  const handleAddItem = () => {
    const newItem: WhatWeDoItem = {
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
      image: "",
    };
    onChange([...items, newItem]);
    setEditingIndex(items.length);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
    if (editingIndex === index) {
      setEditingIndex(null);
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };

  const handleUpdateItem = (index: number, field: keyof WhatWeDoItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    // Validate file size
    const maxSize = imageMaxSize * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size exceeds ${imageMaxSize}MB limit.`);
      return;
    }

    setUploadingImages({ ...uploadingImages, [index]: true });

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const imageUrl = data.imageUrl || data.url || data.data?.url;

      if (imageUrl) {
        handleUpdateItem(index, "image", imageUrl);
        setImagePreviews({ ...imagePreviews, [index]: imageUrl });
      } else {
        throw new Error("No image URL returned from server");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert(error.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingImages({ ...uploadingImages, [index]: false });
    }
  };

  const handleRemoveImage = (index: number) => {
    handleUpdateItem(index, "image", "");
    const newPreviews = { ...imagePreviews };
    delete newPreviews[index];
    setImagePreviews(newPreviews);
  };

  return (
    <div className={styles.whatWeDoArrayField}>
      <div className={styles.arrayFieldHeader}>
        <label>What We Do</label>
        <button
          type="button"
          onClick={handleAddItem}
          className={styles.addArrayItemBtn}
        >
          + Add Item
        </button>
      </div>

      {items.length === 0 && (
        <p className={styles.arrayFieldEmpty}>
          No items added yet. Click "Add Item" to create one.
        </p>
      )}

      {items.map((item, index) => (
        <div key={index} className={styles.arrayItem}>
          <div className={styles.arrayItemHeader}>
            <h4>Item {index + 1}</h4>
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className={styles.removeArrayItemBtn}
            >
              Remove
            </button>
          </div>

          <div className={styles.arrayItemContent}>
            <div className={styles.formGroup}>
              <label>Title (EN) *</label>
              <input
                type="text"
                value={item.titleEn || ""}
                onChange={(e) => handleUpdateItem(index, "titleEn", e.target.value)}
                placeholder="e.g., Full Wedding Planning & Coordination"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Title (AR) *</label>
              <input
                type="text"
                value={item.titleAr || ""}
                onChange={(e) => handleUpdateItem(index, "titleAr", e.target.value)}
                placeholder="مثال: التخطيط الكامل لحفلات الزفاف والتنسيق"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description (EN) *</label>
              <textarea
                value={item.descriptionEn || ""}
                onChange={(e) => handleUpdateItem(index, "descriptionEn", e.target.value)}
                placeholder="Describe this service aspect..."
                rows={4}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Description (AR) *</label>
              <textarea
                value={item.descriptionAr || ""}
                onChange={(e) => handleUpdateItem(index, "descriptionAr", e.target.value)}
                placeholder="وصف هذا الجانب من الخدمة..."
                rows={4}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Image</label>
              <ImageUpload
                imageUrl={item.image || ""}
                imagePreview={imagePreviews[index] || item.image || ""}
                uploadingImage={uploadingImages[index] || false}
                onImageChange={(e) => handleImageUpload(index, e)}
                onRemoveImage={() => handleRemoveImage(index)}
                maxSize={imageMaxSize}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

