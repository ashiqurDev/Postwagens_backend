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
import mongoose from 'mongoose';

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
  const listings = await Listing.find({ sellerId: user.userId }).populate({
    path: 'seller',
    select: 'fullName email avatar',
  });
  return listings;
};

// Get Listings By User Id
const getListingsByUserIdService = async (userId: string) => {
  const listings = await Listing.find({ sellerId: userId }).populate({
    path: 'seller',
    select: 'fullName email avatar',
  });
  return listings;
};

// Get All Listings
const getAllListingsService = async (
  query: Record<string, any>,
  user?: JwtPayload,
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const sort = query.sort || '-createdAt';
  const searchTerm = query.searchTerm;

  const pipeline: any[] = [];

  // Text search
  if (searchTerm) {
    pipeline.push({
      $match: {
        $text: { $search: searchTerm },
      },
    });
  }

  // Other filters
  const excludeField = ['page', 'limit', 'sort', 'fields', 'searchTerm'];
  const filter: Record<string, any> = {};
  for (const key in query) {
    if (!excludeField.includes(key)) {
      filter[key] = query[key];
    }
  }
  if (Object.keys(filter).length > 0) {
    pipeline.push({ $match: filter });
  }

  // Join with users
  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'sellerId',
      foreignField: '_id',
      as: 'seller',
    },
  });

  pipeline.push({
    $unwind: '$seller',
  });

  if (user) {
    // Join with bookmarks
    pipeline.push({
      $lookup: {
        from: 'bookmarks',
        let: { listingId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$listingId', '$$listingId'] },
                  {
                    $eq: [
                      '$userId',
                      new mongoose.Types.ObjectId(user.userId),
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: 'userBookmark',
      },
    });
    // Add isBookmarked field
    pipeline.push({
      $addFields: {
        isBookmarked: { $gt: [{ $size: '$userBookmark' }, 0] },
      },
    });
  } else {
    pipeline.push({
      $addFields: {
        isBookmarked: false,
      },
    });
  }

  // Sorting
  const sortStage: Record<string, any> = {};
  if (sort) {
    const [field, order] = sort.startsWith('-')
      ? [sort.slice(1), -1]
      : [sort, 1];
    sortStage[field] = order;
    pipeline.push({ $sort: sortStage });
  }

  // Pagination
  pipeline.push({ $skip: (page - 1) * limit });
  pipeline.push({ $limit: limit });

  // Projection
  pipeline.push({
    $project: {
      userBookmark: 0,
      'seller.password': 0,
    },
  });

  const result = await Listing.aggregate(pipeline);

  const total = await Listing.countDocuments(filter);
  const meta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  return {
    meta,
    result,
  };
};

// Get Single Listing
const getSingleListingService = async (id: string, user?: JwtPayload) => {
  const pipeline: any[] = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'sellerId',
        foreignField: '_id',
        as: 'seller',
      },
    },
    {
      $unwind: '$seller',
    },
  ];

  if (user) {
    pipeline.push({
      $lookup: {
        from: 'bookmarks',
        let: { listingId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$listingId', '$$listingId'] },
                  {
                    $eq: [
                      '$userId',
                      new mongoose.Types.ObjectId(user.userId),
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: 'userBookmark',
      },
    });
    pipeline.push({
      $addFields: {
        isBookmarked: { $gt: [{ $size: '$userBookmark' }, 0] },
      },
    });
  } else {
    pipeline.push({
      $addFields: {
        isBookmarked: false,
      },
    });
  }

  // Add view count
  await Listing.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

  pipeline.push({
    $project: {
      userBookmark: 0,
      'seller.password': 0,
    },
  });

  const result = await Listing.aggregate(pipeline);

  if (result.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Listing not found');
  }

  return result[0];
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
  getListingsByUserIdService,
};