import { StatusCodes } from 'http-status-codes';
import { CatchAsync } from '../../utils/CatchAsync';
import { BoostService } from './boost.service';
import { SendResponse } from '../../utils/SendResponse';

// BoostType controllers
const createBoostType = CatchAsync(async (req, res) => {
  const result = await BoostService.createBoostType(req.body);
  SendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Boost type created successfully',
    data: result,
  });
});

const getAllBoostTypes = CatchAsync(async (req, res) => {
  const result = await BoostService.getAllBoostTypes();
  SendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Boost types retrieved successfully',
    data: result,
  });
});

const getBoostTypeById = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BoostService.getBoostTypeById(id);
  SendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Boost type retrieved successfully',
    data: result,
  });
});

const updateBoostType = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BoostService.updateBoostType(id, req.body);
  SendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Boost type updated successfully',
    data: result,
  });
});

const deleteBoostType = CatchAsync(async (req, res) => {
  const { id } = req.params;
  await BoostService.deleteBoostType(id);
  SendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Boost type deleted successfully',
    data: null,
  });
});

// ListingBoost controllers
const boostListing = CatchAsync(async (req, res) => {
  const { listingId, boostTypeId } = req.body;
  const userId = req.user.userId;
  const result = await BoostService.boostListing(
    listingId,
    userId,
    boostTypeId,
  );
  SendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Listing boosted successfully',
    data: result,
  });
});

const getListingBoosts = CatchAsync(async (req, res) => {
    const { listingId } = req.params;
    const result = await BoostService.getListingBoosts(listingId);
    SendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Listing boosts retrieved successfully',
        data: result,
    });
});

const getUserBoosts = CatchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await BoostService.getUserBoosts(userId);
    SendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'User boosts retrieved successfully',
        data: result,
    });
});

const getActiveBoosts = CatchAsync(async (req, res) => {
    const result = await BoostService.getActiveBoosts();
    SendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Active boosts retrieved successfully',
        data: result,
    });
});

export const BoostController = {
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
