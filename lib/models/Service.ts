import { ObjectId } from "mongodb";

export interface Service {
  _id?: ObjectId;
  name: string;
  nameEn?: string;
  nameAr?: string;
  slug: string;
  description: string;
  descriptionEn?: string;
  descriptionAr?: string;
  icon: string;
  image?: string; // URL/path to service image
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceInput {
  name: string;
  nameEn?: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionEn?: string;
  descriptionAr: string;
  icon?: string;
  image?: string; // URL/path to service image
  isActive?: boolean;
  order?: number;
}

export interface UpdateServiceInput {
  name?: string;
  nameEn?: string;
  nameAr?: string;
  slug?: string;
  description?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  icon?: string;
  image?: string; // URL/path to service image
  isActive?: boolean;
  order?: number;
}

