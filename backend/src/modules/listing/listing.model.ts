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

listingSchema.post('findOne', async function (doc: any) {
  if (doc) {
    const boost = await Boost.findOne({ listingId: doc._id, endAt: { $gte: new Date() } });
    doc.isBoosted = !!boost;
  }
});

listingSchema.post('find', async function (docs: any[]) {
  if (docs && docs.length) {
    const listingIds = docs.map(doc => doc._id);
    const boosts = await Boost.find({ listingId: { $in: listingIds }, endAt: { $gte: new Date() } });
    const boostedListingIds = new Set(boosts.map(boost => boost.listingId.toString()));
    for (const doc of docs) {
      doc.isBoosted = boostedListingIds.has(doc._id.toString());
    }
  }
});


const Listing = model<IListing>('Listing', listingSchema);

export default Listing;
