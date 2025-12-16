import { ObjectId } from "mongodb";

export interface ServiceFilter {
  _id?: ObjectId;
  key: string;
  nameEn: string;
  nameAr: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceFilterInput {
  key: string;
  nameEn: string;
  nameAr: string;
  isActive?: boolean;
}

export interface UpdateServiceFilterInput {
  key?: string;
  nameEn?: string;
  nameAr?: string;
  isActive?: boolean;
}

