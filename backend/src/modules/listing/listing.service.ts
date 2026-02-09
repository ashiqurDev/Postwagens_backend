import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { IListing } from './listing.interface';
import Listing from './listing.model';
import { JwtPayload } from 'jsonwebtoken';

// Create Listing
const createListingService = async (payload: IListing, user: JwtPayload) => {
  payload.sellerId = user.userId;
  const listing = await Listing.create(payload);
  return listing;
};

// Get My Listings
const getMyListingsService = async (user: JwtPayload) => {
  const listings = await Listing.find({ sellerId: user.userId }).populate('sellerId');
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
  const listing = await Listing.findById(id).populate('sellerId');
  if (!listing) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Listing not found');
  }
  return listing;
};

// Update Listing
const updateListingService = async (
  id: string,
  payload: Partial<IListing>,
  user: JwtPayload
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
