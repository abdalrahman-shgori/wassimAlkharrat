import { ObjectId } from "mongodb";

export interface Service {
  _id?: ObjectId;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string; // URL/path to service image
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceInput {
  name: string;
  slug: string;
  description: string;
  icon?: string;
  image?: string; // URL/path to service image
  isActive?: boolean;
  order?: number;
}

export interface UpdateServiceInput {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  image?: string; // URL/path to service image
  isActive?: boolean;
  order?: number;
}

