import { ObjectId } from "mongodb";

export interface WhatWeDoItem {
  title?: string;
  titleEn?: string;
  titleAr?: string;
  description?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  image?: string;
}

export interface Service {
  _id?: ObjectId;
  name: string;
  nameEn?: string;
  nameAr?: string;
  slug: string;
  description: string;
  descriptionEn?: string;
  descriptionAr?: string;
  title?: string; // Service title for detail page
  titleEn?: string;
  titleAr?: string;
  details?: string; // Service details for detail page
  detailsEn?: string;
  detailsAr?: string;
  whatWeDo?: WhatWeDoItem[]; // Array of "what we do" items
  icon: string;
  image?: string; // URL/path to service image
  filterKey?: string; // Filter key from service filters
  isActive: boolean;
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
  title?: string;
  titleEn?: string;
  titleAr?: string;
  details?: string;
  detailsEn?: string;
  detailsAr?: string;
  whatWeDo?: WhatWeDoItem[];
  icon?: string;
  image?: string; // URL/path to service image
  filterKey?: string; // Filter key from service filters
  isActive?: boolean;
}

export interface UpdateServiceInput {
  name?: string;
  nameEn?: string;
  nameAr?: string;
  slug?: string;
  description?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  title?: string;
  titleEn?: string;
  titleAr?: string;
  details?: string;
  detailsEn?: string;
  detailsAr?: string;
  whatWeDo?: WhatWeDoItem[];
  icon?: string;
  image?: string; // URL/path to service image
  filterKey?: string; // Filter key from service filters
  isActive?: boolean;
}

