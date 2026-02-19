import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import Listing from '../listing/listing.model';
import { BoostType } from './boostType.model';
import { Boost } from './boost.model';
import { IBoostType } from './boostType.interface';

// BoostType services
const createBoostType = async (data: IBoostType) => {
  const boostType = await BoostType.create(data);
  return boostType;
};

const getAllBoostTypes = async () => {
  const boostTypes = await BoostType.find();
  return boostTypes;
};

const getBoostTypeById = async (id: string) => {
  const boostType = await BoostType.findById(id);
  if (!boostType) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Boost type not found');
  }
  return boostType;
};

const updateBoostType = async (id: string, data: Partial<IBoostType>) => {
  const boostType = await BoostType.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!boostType) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Boost type not found');
  }
  return boostType;
};

const deleteBoostType = async (id: string) => {
  const boostType = await BoostType.findByIdAndDelete(id);
  if (!boostType) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Boost type not found');
  }
  return null;
};

// ListingBoost services
const boostListing = async (
  listingId: string,
  userId: string,
  boostTypeId: string,
) => {
  const listing = await Listing.findById(listingId);
  if (!listing) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Listing not found');
  }

  // Ensure the user is not trying to boost their own listing if that's a rule
  // (Assuming a user can boost any listing for now)

  const boostType = await BoostType.findById(boostTypeId);
  if (!boostType) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Boost type not found');
  }

  // Check for an existing active boost for this listing
  const existingBoost = await Boost.findOne({ listingId: listingId, endAt: { $gte: new Date() } });
  if (existingBoost) {
    throw new AppError(StatusCodes.CONFLICT, 'This listing is already boosted.');
  }

  const startAt = new Date();
  const endAt = new Date();
  endAt.setDate(startAt.getDate() + boostType.durationDays);

  // Create the boost document
  await Boost.create({
    listingId,
    userId,
    boostTypeId,
    startAt,
    endAt,
  });

  // Update the listing to set isBoosted to true
  const updatedListing = await Listing.findByIdAndUpdate(
    listingId,
    { isBoosted: true },
    { new: true }
  );

  return updatedListing;
};

const getListingBoosts = async (listingId: string) => {
    const boosts = await Boost.find({ listingId }).populate('boostTypeId');
    return boosts;
};

const getUserBoosts = async (userId: string) => {
    const boosts = await Boost.find({ userId }).populate('listingId boostTypeId');
    return boosts;
};

const getActiveBoosts = async () => {
    const boosts = await Boost.find({ endAt: { $gte: new Date() } }).populate('listingId boostTypeId userId', 'fullName avatar isVerified title description price imagesAndVideos category location condition');
    return boosts;
};

const getRevenueOverview = async (year: number) => {
  const result = await Boost.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $year: '$createdAt' }, year],
        },
      },
    },
    {
      $lookup: {
        from: 'boosttypes',
        localField: 'boostTypeId',
        foreignField: '_id',
        as: 'boostType',
      },
    },
    {
      $unwind: '$boostType',
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalRevenue: { $sum: '$boostType.price' },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        totalRevenue: 1,
      },
    },
  ]);
  return result;
};


export const BoostService = {
  createBoostType,
  getAllBoostTypes,
  getBoostTypeById,
  updateBoostType,
  deleteBoostType,
  boostListing,
  getListingBoosts,
  getUserBoosts,
  getActiveBoosts,
  getRevenueOverview,
};
