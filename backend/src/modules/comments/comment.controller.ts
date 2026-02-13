import { StatusCodes } from 'http-status-codes';
import { CatchAsync } from '../../utils/CatchAsync';
import { CommentService } from './comment.service';
import { SendResponse } from '../../utils/SendResponse';

const createComment = CatchAsync(async (req, res) => {
  const { id } = req.params;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = req.user.userId;
  const { text, parentId } = req.body;

  const payload = {
    postId: id,
    userId,
    text,
    parentId: parentId || null,
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result = await CommentService.createComment(payload);
  SendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Comment created successfully',
    data: result,
  });
});

const getCommentsForPost = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CommentService.getCommentsForPost(id, req.query);
  SendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Comments for the post retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateComment = CatchAsync(async (req, res) => {
  const { commentId } = req.params;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = req.user.userId;
  const result = await CommentService.updateComment(
    commentId,
    userId,
    req.body,
  );
  SendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Comment updated successfully',
    data: result,
  });
});

const deleteComment = CatchAsync(async (req, res) => {
  const { commentId } = req.params;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = req.user.userId;
  await CommentService.deleteComment(commentId, userId);
  SendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Comment deleted successfully',
    data: null,
  });
});

export const CommentController = {
  createComment,
  getCommentsForPost,
  updateComment,
  deleteComment,
};

