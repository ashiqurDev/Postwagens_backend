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

  const boostType = await BoostType.findById(boostTypeId);
  if (!boostType) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Boost type not found');
  }

  const startAt = new Date();
  const endAt = new Date();
  endAt.setDate(startAt.getDate() + boostType.durationDays);

  const boost = await Boost.create({
    listingId,
    userId,
    boostTypeId,
    startAt,
    endAt,
  });

  return boost;
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
    const boosts = await Boost.find({ endAt: { $gte: new Date() } }).populate('listingId boostTypeId');
    return boosts;
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
};
