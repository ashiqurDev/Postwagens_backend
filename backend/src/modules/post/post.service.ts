import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { TPost } from './post.interface';
import Post from './post.model';
import { JwtPayload } from 'jsonwebtoken';
import {
  deleteImageFromCLoudinary,
  uploadBufferToCloudinary,
} from '../../config/cloudinary.config';
import '../users/user.model'; // Import user model to resolve ref in post model


// Create Post
const createPostService = async (
  payload: TPost,
  user: JwtPayload,
  files: Express.Multer.File[],
) => {
  payload.userId = user.userId;

  if (files && files.length > 0) {
    const imagesAndVideos: string[] = [];
    for (const file of files) {
      const uploadedFile = await uploadBufferToCloudinary(
        file.buffer,
        file.originalname,
      );
      if (uploadedFile) {
        imagesAndVideos.push(uploadedFile.secure_url);
      }
    }
    payload.imagesAndVideos = imagesAndVideos;
  }

  const post = await Post.create(payload);
  return post;
};

// Get My Posts
const getMyPostsService = async (user: JwtPayload) => {
  const posts = await Post.find({ userId: user.userId }).populate(
    'userId',
    'fullName email',
  );
  return posts;
};

// Get All Posts
const getAllPostsService = async (query: Record<string, string>) => {
  const postQuery = new QueryBuilder(Post.find(), query)
    .textSearch()
    .filter()
    .sort()
    .paginate()
    .select();

  const result = await postQuery.build();
  const meta = await postQuery.getMeta();

  return {
    meta,
    result,
  };
};

// Get Single Post
const getSinglePostService = async (id: string) => {
  const post = await Post.findById(id).populate('userId');
  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Post not found');
  }
  return post;
};

// Update Post
const updatePostService = async (
  id: string,
  payload: Partial<TPost>,
  user: JwtPayload,
  files: Express.Multer.File[],
) => {
  const post = await Post.findById(id);

  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Post not found');
  }

  if (post.userId.toString() !== user.userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to update this post',
    );
  }

  if (files && files.length > 0) {
    // Delete old images from Cloudinary
    if (post.imagesAndVideos && post.imagesAndVideos.length > 0) {
      for (const imageUrl of post.imagesAndVideos) {
        await deleteImageFromCLoudinary(imageUrl);
      }
    }

    // Upload new images
    const imagesAndVideos: string[] = [];
    for (const file of files) {
      const uploadedFile = await uploadBufferToCloudinary(
        file.buffer,
        file.originalname,
      );
      if (uploadedFile) {
        imagesAndVideos.push(uploadedFile.secure_url);
      }
    }
    payload.imagesAndVideos = imagesAndVideos;
  }

  const updatedPost = await Post.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedPost;
};

// Delete Post
const deletePostService = async (id: string, user: JwtPayload) => {
  const post = await Post.findById(id);

  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Post not found');
  }

  if (post.userId.toString() !== user.userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to delete this post',
    );
  }

  // Delete images from Cloudinary before deleting the post
  if (post.imagesAndVideos && post.imagesAndVideos.length > 0) {
    for (const imageUrl of post.imagesAndVideos) {
      await deleteImageFromCLoudinary(imageUrl);
    }
  }

  await Post.findByIdAndDelete(id);

  return null;
};

export const postServices = {
  createPostService,
  getMyPostsService,
  getAllPostsService,
  getSinglePostService,
  updatePostService,
  deletePostService,
};
