import { Types } from 'mongoose';

export interface IBoost {
  listingId: Types.ObjectId;
  userId: Types.ObjectId;
  startAt: Date;
  endAt: Date;
  boostTypeId: Types.ObjectId;
  processed?: boolean;
}
