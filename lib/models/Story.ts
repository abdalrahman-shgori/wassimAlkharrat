import { ObjectId } from "mongodb";

export interface Story {
  _id?: ObjectId;
  image: string; // URL/path to story image
  names: string; // Names of the people in the story
  testimonial: string; // Testimonial text
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStoryInput {
  image: string;
  names: string;
  testimonial: string;
  isActive?: boolean;
  order?: number;
}

export interface UpdateStoryInput {
  image?: string;
  names?: string;
  testimonial?: string;
  isActive?: boolean;
  order?: number;
}

