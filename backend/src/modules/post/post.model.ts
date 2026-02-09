import { Schema, model } from 'mongoose';
import { TPost } from './post.interface';

const postSchema = new Schema<TPost>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    text: { type: String, required: true },
    imagesAndVideos: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

postSchema.index({ text: 'text' });

const Post = model<TPost>('Post', postSchema);

export default Post;
