import { ObjectId } from "mongodb";

export interface IUser {
  _id?: ObjectId;
  profileId?: ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  createdOn?: number | string; /* Change to date later */
  lastLogin?: number | string; /* Change to date later */
  ssnValidated?: boolean;
  notifications?: null;
  LastTribeOpened?: string;
}