import { Model, Types } from 'mongoose';

export interface IVerifiedBadgePrice {
  id?: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  durationDays: number;
}

export type VerifiedBadgePriceModel = Model<IVerifiedBadgePrice, Record<string, never>>;
