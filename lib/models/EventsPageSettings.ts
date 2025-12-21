import { ObjectId } from "mongodb";

export interface EventsPageSettings {
  _id?: ObjectId;
  heroImage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertEventsPageSettingsInput {
  heroImage: string;
}

