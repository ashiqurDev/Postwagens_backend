import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import  Post  from '../post/post.model';
import { Comment } from './comment.model';
import { TComment } from './comment.interface';
import {QueryBuilder} from '../../utils/QueryBuilder';
import { NotificationService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/notifications.interface';
import { Types } from 'mongoose';

const createComment = async (payload: TComment) => {
  const post = await Post.findById(payload.postId);

  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Post not found');
  }

  if (payload.parentId) {
    const parentComment = await Comment.findById(payload.parentId);
    if (!parentComment) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Parent comment not found');
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const comment = await Comment.create(payload);

  // Create notification for the post author
  if (post.userId.toString() !== payload.userId.toString()) {
    await NotificationService.createNotification({
        userId: post.userId,
        actorId: new Types.ObjectId(payload.userId),
        type: NotificationType.COMMENT,
        entity: {
            postId: post._id,
            commentId: comment._id,
        },
        isRead: false,
    });
  }

  // Create notification for the parent comment author
  if (payload.parentId) {
    const parentComment = await Comment.findById(payload.parentId);
    if (parentComment && parentComment.userId.toString() !== payload.userId.toString()) {
        await NotificationService.createNotification({
            userId: parentComment.userId,
            actorId: new Types.ObjectId(payload.userId),
            type: NotificationType.COMMENT, // Or a new type like 'reply'
            entity: {
                postId: post._id,
                commentId: comment._id,
            },
            isRead: false,
        });
    }
  }

  return comment;
};

const getCommentsForPost = async (
  postId: string,
  query: Record<string, unknown>,
) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Post not found');
  }

  const commentQuery = new QueryBuilder(
    Comment.find({ postId }).populate('userId'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .select();

  const result = await commentQuery.build();
  const meta = await commentQuery.getMeta();

  return {
    meta,
    result,
  };
};

const updateComment = async (
  commentId: string,
  userId: string,
  payload: Partial<TComment>,
) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Comment not found');
  }

  if (comment.userId.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to update this comment',
    );
  }

  const result = await Comment.findByIdAndUpdate(commentId, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteComment = async (commentId: string, userId: string) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Comment not found');
  }

  if (comment.userId.toString() !== userId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to delete this comment',
    );
  }

  await Comment.findByIdAndDelete(commentId);

  return null;
};

export const CommentService = {
  createComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
};
