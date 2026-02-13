import { RequestHandler } from 'express';
import {CatchAsync} from '../../utils/CatchAsync';
import { VerifiedBadgePriceService } from './verified_badge_prices.service';
import {SendResponse} from '../../utils/SendResponse';
import { StatusCodes } from 'http-status-codes';

const createBadgePrice: RequestHandler = CatchAsync(async (req, res) => {
  const result = await VerifiedBadgePriceService.createBadgePrice(req.body);
  SendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Badge price created successfully',
    data: result,
  });
});

const getAllBadgePrices: RequestHandler = CatchAsync(async (req, res) => {
  const result = await VerifiedBadgePriceService.getAllBadgePrices();
  SendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Badge prices retrieved successfully',
    data: result,
  });
});

const getBadgePriceById: RequestHandler = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await VerifiedBadgePriceService.getBadgePriceById(id as string);
  SendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Badge price retrieved successfully',
    data: result,
  });
});

const updateBadgePrice: RequestHandler = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await VerifiedBadgePriceService.updateBadgePrice(id as string, req.body);
  SendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Badge price updated successfully',
    data: result,
  });
});

const deleteBadgePrice: RequestHandler = CatchAsync(async (req, res) => {
  const { id } = req.params;
  await VerifiedBadgePriceService.deleteBadgePrice(id as string);
  SendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Badge price deleted successfully',
    data: null,
  });
});

export const VerifiedBadgePriceController = {
  createBadgePrice,
  getAllBadgePrices,
  getBadgePriceById,
  updateBadgePrice,
  deleteBadgePrice,
};
