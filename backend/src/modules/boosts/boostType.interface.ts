import { Types } from 'mongoose';

export interface IBoostType {
  name: string;
  description: string;
  price: number;
  durationDays: number;
}
