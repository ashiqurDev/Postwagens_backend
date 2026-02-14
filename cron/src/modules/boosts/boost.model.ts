import { Schema, model } from 'mongoose';
import { IBoost } from './boost.interface';

const boostSchema = new Schema<IBoost>(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    boostTypeId: {
      type: Schema.Types.ObjectId,
      ref: 'BoostType',
      required: true,
    },
    processed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const Boost = model<IBoost>(
  'Boost',
  boostSchema,
);
