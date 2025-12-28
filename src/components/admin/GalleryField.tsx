'use client';

import { useState } from 'react';
import { FaPlus, FaTimes, FaVideo } from 'react-icons/fa';
import Image from 'next/image';
import styles from './GalleryField.module.scss';
// YouTube utility functions
function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'maxres'): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

type GalleryItem = string | { type: 'video'; url: string; thumbnail?: string };

interface GalleryFieldProps {
  images: Array<string | { type: 'video'; url: string; thumbnail?: string }>;
  onChange: (items: Array<string | { type: 'video'; url: string; thumbnail?: string }>) => void;
  uploadEndpoint: string;
  maxSize?: number;
}

export default function GalleryField({ 
  images, 
  onChange, 
  uploadEndpoint,
  maxSize = 10 
}: GalleryFieldProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate all files first
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSizeBytes = maxSize * 1024 * 1024;
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(`${file.name}: Invalid file type`);
      } else if (file.size > maxSizeBytes) {
        invalidFiles.push(`${file.name}: File size exceeds ${maxSize}MB`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      alert(`Some files were rejected:\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length === 0) {
      e.target.value = '';
      return;
    }

    // Upload files sequentially
    const uploadedUrls: string[] = [];
    setUploadingIndex(images.length);

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData,
          credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        const imageUrl = data.imageUrl || data.url || data.data?.url;

        if (imageUrl) {
          uploadedUrls.push(imageUrl);
        } else {
          throw new Error("No image URL returned from server");
        }
      } catch (error: any) {
        console.error(`Error uploading ${file.name}:`, error);
        alert(`Failed to upload ${file.name}: ${error.message || "Please try again."}`);
      }
    }

    // Update images array once with all uploaded URLs
    if (uploadedUrls.length > 0) {
      onChange([...images, ...uploadedUrls]);
    }

    setUploadingIndex(null);
    // Reset input
    e.target.value = '';
  };

  const handleAddVideo = () => {
    if (!videoUrl.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    if (!isValidYouTubeUrl(videoUrl)) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      alert('Invalid YouTube URL');
      return;
    }

    const thumbnail = getYouTubeThumbnail(videoId);
    const videoItem: { type: 'video'; url: string; thumbnail: string } = {
      type: 'video',
      url: videoUrl,
      thumbnail,
    };

    onChange([...images, videoItem]);
    setVideoUrl('');
    setShowVideoModal(false);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  const isVideo = (item: GalleryItem): item is { type: 'video'; url: string; thumbnail?: string } => {
    return typeof item === 'object' && item !== null && 'type' in item && item.type === 'video';
  };

  const getItemUrl = (item: GalleryItem): string => {
    if (typeof item === 'string') return item;
    return item.thumbnail || '';
  };

  const inputId = `gallery-upload-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.galleryField}>
      <label>Event Gallery</label>
      <div className={styles.galleryGrid}>
        {images.map((item, index) => {
          const itemUrl = getItemUrl(item);
          const isVideoItem = isVideo(item);
          
          return (
            <div key={index} className={styles.galleryItem}>
              <div className={styles.imageWrapper}>
                {itemUrl && (
                  isVideoItem ? (
                    <img
                      src={itemUrl}
                      alt={`Gallery video ${index + 1}`}
                      className={styles.galleryImage}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Image
                      src={itemUrl}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className={styles.galleryImage}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )
                )}
                {isVideoItem && (
                  <div className={styles.videoBadge}>
                    <FaVideo />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className={styles.removeButton}
                  aria-label={isVideoItem ? "Remove video" : "Remove image"}
                >
                  <FaTimes />
                </button>
              </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleReorder(index, index - 1)}
                className={styles.moveButton}
                title="Move left"
              >
                ←
              </button>
            )}
            {index < images.length - 1 && (
              <button
                type="button"
                onClick={() => handleReorder(index, index + 1)}
                className={styles.moveButton}
                title="Move right"
              >
                →
              </button>
            )}
            </div>
          );
        })}
        
        <div className={styles.uploadArea}>
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className={styles.addVideoButton}
            title="Add YouTube Video"
          >
            <FaVideo />
            <span>Add Video</span>
          </button>
        </div>
        
        <div className={styles.uploadArea}>
          <input
            type="file"
            id={inputId}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={uploadingIndex !== null}
            multiple
            style={{ display: "none" }}
          />
          <label htmlFor={inputId} className={styles.uploadLabel}>
            {uploadingIndex !== null ? (
              <span>Uploading...</span>
            ) : (
              <>
                <FaPlus />
                <span>Add Images</span>
                <small>Select multiple images (JPEG, PNG, or WebP, max {maxSize}MB each)</small>
              </>
            )}
          </label>
        </div>
      </div>
      {images.length > 0 && (
        <small className={styles.helpText}>
          {images.length} item{images.length !== 1 ? 's' : ''} in gallery (images and videos).
        </small>
      )}

      {/* Video URL Modal */}
      {showVideoModal && (
        <div className={styles.modalOverlay} onClick={() => setShowVideoModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Add YouTube Video</h3>
            <input
              type="text"
              placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...) or https://youtu.be/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className={styles.videoUrlInput}
            />
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => {
                  setShowVideoModal(false);
                  setVideoUrl('');
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddVideo}
                className={styles.addButton}
              >
                Add Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

