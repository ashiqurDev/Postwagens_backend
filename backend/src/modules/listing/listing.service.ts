import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { IImageAndVideo, IListing } from './listing.interface';
import Listing from './listing.model';
import { JwtPayload } from 'jsonwebtoken';
import {
  deleteImageFromCLoudinary,
  uploadBufferToCloudinary,
} from '../../config/cloudinary.config';
import User from '../users/user.model';

// Create Listing
const createListingService = async (
  payload: IListing,
  user: JwtPayload,
  files: Express.Multer.File[]
) => {
  payload.sellerId = user.userId;

  if (files && files.length > 0) {
    const imagesAndVideos: IImageAndVideo[] = [];
    for (const file of files) {
      const uploadedFile = await uploadBufferToCloudinary(
        file.buffer,
        file.originalname
      );
      if (uploadedFile) {
        imagesAndVideos.push({
          type: file.mimetype.startsWith('image') ? 'image' : 'video',
          url: uploadedFile.secure_url,
        });
      }
    }
    payload.imagesAndVideos = imagesAndVideos;
  }

  const listing = await Listing.create(payload);
  return listing;
};

// Get My Listings
const getMyListingsService = async (user: JwtPayload) => {
  const listings = await Listing.find({ sellerId: user.userId }).populate('sellerId', 'fullName email');
  return listings;
};

// Get All Listings
const getAllListingsService = async (query: Record<string, string>) => {
  const listingQuery = new QueryBuilder(Listing.find(), query)
    .textSearch()
    .filter()
    .sort()
    .paginate()
    .select();

  const result = await listingQuery.build();
  const meta = await listingQuery.getMeta();

  return {
    meta,
    result,
  };
};

// Get Single Listing
const getSingleListingService = async (id: string) => {
  const listing = await Listing.findByIdAndUpdate(
    id,
    { $inc: { viewCount: 1 } },
    { new: true }
  ).populate('sellerId');

  if (!listing) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Listing not found');
  }
  return listing;
};

// Update Listing
const updateListingService = async (
  id: string,
  payload: Partial<IListing>,
  user: JwtPayload,
  files: Express.Multer.File[]
) => {
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Listing not found');
  }

  if (listing.sellerId.toString() !== user.userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to update this listing'
    );
  }

  if (files && files.length > 0) {
    // Delete old images from Cloudinary
    if (listing.imagesAndVideos && listing.imagesAndVideos.length > 0) {
      for (const image of listing.imagesAndVideos) {
        await deleteImageFromCLoudinary(image.url);
      }
    }

    // Upload new images
    const newImagesAndVideos: IImageAndVideo[] = [];
    for (const file of files) {
      const uploadedFile = await uploadBufferToCloudinary(
        file.buffer,
        file.originalname
      );
      if (uploadedFile) {
        newImagesAndVideos.push({
          type: file.mimetype.startsWith('image') ? 'image' : 'video',
          url: uploadedFile.secure_url,
        });
      }
    }
    payload.imagesAndVideos = newImagesAndVideos;
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedListing;
};

// Delete Listing
const deleteListingService = async (id: string, user: JwtPayload) => {
  const listing = await Listing.findById(id);

  if (!listing) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Listing not found');
  }

  if (listing.sellerId.toString() !== user.userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to delete this listing'
    );
  }
  
  // Delete images from Cloudinary before deleting the listing
  if (listing.imagesAndVideos && listing.imagesAndVideos.length > 0) {
    for (const image of listing.imagesAndVideos) {
      await deleteImageFromCLoudinary(image.url);
    }
  }

  await Listing.findByIdAndDelete(id);

  return null;
};

export const listingServices = {
  createListingService,
  getMyListingsService,
  getAllListingsService,
  getSingleListingService,
  updateListingService,
  deleteListingService,
};