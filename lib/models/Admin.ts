import { ObjectId } from "mongodb";

export interface Admin {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminWithoutPassword {
  _id: ObjectId;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export function removePassword(admin: Admin): AdminWithoutPassword {
  const { passwordHash, ...adminWithoutPassword } = admin;
  return adminWithoutPassword as AdminWithoutPassword;
}

