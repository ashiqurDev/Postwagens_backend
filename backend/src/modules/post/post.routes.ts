import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  createPostZodSchema,
  updatePostZodSchema,
} from './post.validation';
import { postControllers } from './post.controller';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from '../users/user.interface';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.post(
  '/',
  checkAuth(...Object.values(Role)),
  multerUpload.array('imagesAndVideos'),
  validateRequest(createPostZodSchema),
  postControllers.createPost,
);

router.get('/', postControllers.getAllPosts);

router.get(
  '/my-posts',
  checkAuth(...Object.values(Role)),
  postControllers.getMyPosts,
);

router.get('/:id', postControllers.getSinglePost);

router.patch(
  '/:id',
  checkAuth(...Object.values(Role)),
  multerUpload.array('imagesAndVideos'),
  validateRequest(updatePostZodSchema),
  postControllers.updatePost,
);

router.delete(
  '/:id',
  checkAuth(...Object.values(Role)),
  postControllers.deletePost,
);

export const postRoutes = router;
