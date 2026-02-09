import { Types } from 'mongoose';

export interface IImageAndVideo {
  type: 'image' | 'video';
  url: string;
}

// posts [icon: message-square, color: green]{
//   id string pk
//   userId string
//   text string
//   imagesAndVideos string[] // array of image URLs
//   createdAt datetime
//   updatedAt datetime
// }

export interface IPost {
  userId: Types.ObjectId;
  text: string;
  imagesAndVideos: IImageAndVideo[];
}
