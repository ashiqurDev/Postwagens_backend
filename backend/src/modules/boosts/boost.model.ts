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
  },
    {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        // 🔁 rename populated fields
        (ret as any).user = ret.userId;
        (ret as any).listing = ret.listingId;
        (ret as any).boostType = ret.boostTypeId;

        // ❌ remove raw ids
        delete (ret as any).userId;
        delete (ret as any).listingId;
        delete (ret as any).boostTypeId;

        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  },
);

export const Boost = model<IBoost>(
  'Boost',
  boostSchema,
);
