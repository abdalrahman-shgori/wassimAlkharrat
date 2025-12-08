"use client";

import React, { useState } from "react";
import styles from "./admin.module.scss";

interface ImageUploadProps {
  imageUrl: string;
  imagePreview: string | null;
  uploadingImage: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  maxSize?: number; // in MB
  folder?: string;
}

export default function ImageUpload({
  imageUrl,
  imagePreview,
  uploadingImage,
  onImageChange,
  onRemoveImage,
  maxSize = 5,
}: ImageUploadProps) {
  const inputId = `image-upload-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.imageUploadContainer}>
      {imagePreview ? (
        <div className={styles.imagePreview}>
          <img src={imagePreview} alt="Preview" />
          <button
            type="button"
            onClick={onRemoveImage}
            className={styles.removeImageBtn}
          >
            ✕ Remove
          </button>
        </div>
      ) : (
        <div className={styles.imageUploadArea}>
          <input
            type="file"
            id={inputId}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={onImageChange}
            disabled={uploadingImage}
            style={{ display: "none" }}
          />
          <label htmlFor={inputId} className={styles.uploadLabel}>
            {uploadingImage ? (
              <span>Uploading...</span>
            ) : (
              <>
                <span>📷</span>
                <span>Click to upload image</span>
                <small>JPEG, PNG, or WebP (max {maxSize}MB)</small>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
}

