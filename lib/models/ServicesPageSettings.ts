import { ObjectId } from "mongodb";

export interface ServicesPageSettings {
  _id?: ObjectId;
  heroImage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertServicesPageSettingsInput {
  heroImage: string;
}

