"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import ImageUpload from "./ImageUpload";
import styles from "./admin.module.scss";

const DEFAULT_HERO_IMAGE = "/images/homepage/DSC06702.webp";

export default function HomepageSettingsForm() {
  const locale = useLocale();
  const [heroImage, setHeroImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const baseHeaders = useMemo(
    () => ({
      "Accept-Language": locale,
    }),
    [locale]
  );

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/homepage-settings", {
        headers: baseHeaders,
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to load homepage settings");
        return;
      }

      const currentImage = data?.data?.heroImage || data?.defaultHeroImage || DEFAULT_HERO_IMAGE;
      setHeroImage(currentImage);
      setImagePreview(currentImage || null);
    } catch (err) {
      console.error(err);
      setError("Failed to load homepage settings");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError("File size exceeds 10MB limit.");
      return;
    }

    try {
      setUploadingImage(true);
      setSuccess("");

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/homepage-settings/upload", {
        method: "POST",
        headers: baseHeaders,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to upload image");
        return;
      }

      setHeroImage(data.imageUrl);
      setImagePreview(data.imageUrl);
      setSuccess("Image uploaded successfully");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      console.error(err);
      setError("An error occurred while uploading the image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setHeroImage("");
    setImagePreview(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!heroImage) {
      setError("Please upload a hero background image before saving.");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/homepage-settings", {
        method: "PUT",
        headers: { ...baseHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ heroImage }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to save homepage settings");
        return;
      }

      setSuccess("Homepage hero image saved");
    } catch (err) {
      console.error(err);
      setError("Failed to save homepage settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading homepage settings...</div>;
  }

  return (
    <form className={styles.form} onSubmit={handleSave}>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.formGroup}>
        <label>Hero Background Image</label>
        <p style={{ margin: "0 0 0.75rem 0", color: "#666" }}>
          Upload a high-quality background image for the homepage hero section.
        </p>
        <ImageUpload
          imageUrl={heroImage}
          imagePreview={imagePreview}
          uploadingImage={uploadingImage}
          onImageChange={handleImageUpload}
          onRemoveImage={handleRemoveImage}
          maxSize={10}
        />
        <small>Recommended: landscape orientation, optimized for web (max 10MB).</small>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={() => {
            setHeroImage(imagePreview || DEFAULT_HERO_IMAGE);
            setError("");
            setSuccess("");
          }}
          disabled={saving}
        >
          Reset changes
        </button>
        <button type="submit" className={styles.submitBtn} disabled={saving}>
          {saving ? "Saving..." : "Save hero image"}
        </button>
      </div>
    </form>
  );
}


