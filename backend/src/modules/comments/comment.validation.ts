import { z } from 'zod';

const createCommentSchema = z.object({
  body: z.object({
    text: z.string(),
    parentId: z.string().optional(),
  }),
});

const updateCommentSchema = z.object({
  body: z.object({
    text: z.string().optional(),
  }),
});

export const CommentValidation = {
  createCommentSchema,
  updateCommentSchema,
};
