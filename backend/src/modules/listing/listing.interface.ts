import { Types } from 'mongoose';

export enum ListingCategory {
  VWCars = 'VW cars',
  OffRoadVehicles = 'Off-road vehicles',
  VehicleParts = 'Vehicle parts',
}

export interface IImageAndVideo {
  type: 'image' | 'video';
  url: string;
}

export interface IListing {
  title: string;
  description: string;
  price: number;
  imagesAndVideos: IImageAndVideo[];
  category: ListingCategory;
  condition: string;
  location: string;
  sold: boolean;
  sellerId: Types.ObjectId;
  isBoosted: boolean;
  boostExpiresAt?: Date;
}
