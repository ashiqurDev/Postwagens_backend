import { Model, Types } from 'mongoose';

export type TPost = {
  userId: Types.ObjectId;
  text: string;
  imagesAndVideos?: string[];
};

export type PostModel = Model<TPost, Record<string, unknown>>;