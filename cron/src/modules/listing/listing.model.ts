import { Schema, model } from 'mongoose';
import { IListing, ListingCategory } from './listing.interface';
import { Boost } from '../boosts/boost.model';

const listingSchema = new Schema<IListing>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imagesAndVideos: [
      {
        type: { type: String, enum: ['image', 'video'], required: true },
        url: { type: String, required: true },
      },
    ],
    category: {
      type: String,
      enum: Object.values(ListingCategory),
      required: true,
    },
    condition: { type: String, required: true },
    location: { type: String, required: true },
    sold: { type: Boolean, default: false },
    sellerId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    isBoosted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    }
  }
);

listingSchema.index({ title: 'text', description: 'text', location: 'text' });


const Listing = model<IListing>('Listing', listingSchema);

export default Listing;
