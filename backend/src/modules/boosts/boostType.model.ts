import { Schema, model } from 'mongoose';
import { IBoostType } from './boostType.interface';

const boostTypeSchema = new Schema<IBoostType>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

export const BoostType = model<IBoostType>('BoostType', boostTypeSchema);
