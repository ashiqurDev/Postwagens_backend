import { z } from 'zod';
import { ListingCategory } from './listing.interface';

const imageAndVideoSchema = z.object({
  type: z.enum(['image', 'video']),
  url: z.string(),
});

export const createListingZodSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  imagesAndVideos: z.array(imageAndVideoSchema).optional(),
  category: z.nativeEnum(ListingCategory),
  condition: z.string(),
  location: z.string(),
});

export const updateListingZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  imagesAndVideos: z.array(imageAndVideoSchema).optional(),
  category: z.nativeEnum(ListingCategory).optional(),
  condition: z.string().optional(),
  location: z.string().optional(),
  sold: z.boolean().optional(),
  isBoosted: z.boolean().optional(),
  boostExpiresAt: z.date().optional(),
});
