import { ObjectId } from "mongodb";

export interface GalleryCategory {
  _id?: ObjectId;
  key: string; // Unique identifier (e.g., "weddings", "birthdays")
  nameEn: string; // English name (e.g., "Weddings")
  nameAr: string; // Arabic name (e.g., "أعراس")
  order?: number; // Display order
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGalleryCategoryInput {
  key: string;
  nameEn: string;
  nameAr: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateGalleryCategoryInput {
  key?: string;
  nameEn?: string;
  nameAr?: string;
  order?: number;
  isActive?: boolean;
}
