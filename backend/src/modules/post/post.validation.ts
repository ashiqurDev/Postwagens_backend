import { z } from 'zod';

export const createPostZodSchema = z.object({
    text: z.string(),
    imagesAndVideos: z.array(z.string()).optional(),
  });

export const updatePostZodSchema = z.object({
    text: z.string().optional(),
    imagesAndVideos: z.array(z.string()).optional(),
  })
