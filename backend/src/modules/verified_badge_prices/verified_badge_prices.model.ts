import { Schema, model } from 'mongoose';
import { IVerifiedBadgePrice, VerifiedBadgePriceModel } from './verified_badge_prices.interface';

const verifiedBadgePriceSchema = new Schema<IVerifiedBadgePrice, VerifiedBadgePriceModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const VerifiedBadgePrice = model<IVerifiedBadgePrice, VerifiedBadgePriceModel>(
  'VerifiedBadgePrice',
  verifiedBadgePriceSchema,
);
