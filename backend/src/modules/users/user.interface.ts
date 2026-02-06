import { Types } from 'mongoose';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER',
}
export interface IAuthProvider {
  provider: 'credentials' | 'google' | 'apple';
  providerId: string;
}


export enum IsActive {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export interface ICoord {
  lat: number;
  long: number;
}

export interface IUser {
  _id?: Types.ObjectId;
  fullName?: string;
  email: string;
  bio?: string;
  avatar?: string;
  password?: string;
  gender?: string;
  fcmToken?: string;
  instagramHandle?: string;
  badge?: boolean;
  role: Role;
  stripeAccountId?: string;
  phone?: string;
  interests?: Types.ObjectId[];
  isActive?: IsActive;
  isDeleted?: boolean;
  isVerified?: boolean;
  auths?: IAuthProvider[];
  location?: string;
  coord?: ICoord;
}