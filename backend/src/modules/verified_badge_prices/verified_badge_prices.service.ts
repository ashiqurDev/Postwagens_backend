import { IVerifiedBadgePrice } from './verified_badge_prices.interface';
import { VerifiedBadgePrice } from './verified_badge_prices.model';

const createBadgePrice = async (payload: IVerifiedBadgePrice) => {
  return await VerifiedBadgePrice.create(payload);
};

const getAllBadgePrices = async () => {
  return await VerifiedBadgePrice.find();
};

const getBadgePriceById = async (id: string) => {
  return await VerifiedBadgePrice.findById(id);
};

const updateBadgePrice = async (id: string, payload: Partial<IVerifiedBadgePrice>) => {
  return await VerifiedBadgePrice.findByIdAndUpdate(id, payload, { new: true });
};

const deleteBadgePrice = async (id: string) => {
  return await VerifiedBadgePrice.findByIdAndDelete(id);
};

export const VerifiedBadgePriceService = {
  createBadgePrice,
  getAllBadgePrices,
  getBadgePriceById,
  updateBadgePrice,
  deleteBadgePrice,
};
