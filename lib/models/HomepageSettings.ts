import { ObjectId } from "mongodb";

export interface HomepageSettings {
  _id?: ObjectId;
  heroImage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertHomepageSettingsInput {
  heroImage: string;
}


