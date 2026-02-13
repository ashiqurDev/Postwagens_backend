import { Schema, model } from 'mongoose';
import { TComment, CommentModel } from './comment.interface';

const commentSchema = new Schema<TComment, CommentModel>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'post',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Comment = model<TComment, CommentModel>('Comment', commentSchema);
