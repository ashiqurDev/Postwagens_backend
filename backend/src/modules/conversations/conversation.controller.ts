import { StatusCodes } from 'http-status-codes';
import { CatchAsync } from '../../utils/CatchAsync';
import { ConversationService } from './conversation.service';
import { SendResponse } from '../../utils/SendResponse';

const createConversation = CatchAsync(async (req, res) => {
  const { participantBId } = req.body;
  const participantAId = req.user.userId;
  const result = await ConversationService.createConversation(
    participantAId,
    participantBId,
  );
  SendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Conversation created successfully',
    data: result,
  });
});

const sendMessage = CatchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const { text } = req.body;
  const senderId = req.user.userId;
  const file = req.file;

  const result = await ConversationService.sendMessage(
    conversationId,
    senderId,
    text,
    file,
  );
  SendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

const getConversationsForUser = CatchAsync(async (req, res) => {
    const userId = req.user.userId;
    const result = await ConversationService.getConversationsForUser(userId);
    SendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Conversations retrieved successfully',
        data: result,
    });
});

const getMessagesForConversation = CatchAsync(async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.userId;
    const result = await ConversationService.getMessagesForConversation(conversationId, userId);
    SendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Messages retrieved successfully',
        data: result,
    });
});

const markMessagesAsRead = CatchAsync(async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.userId;
    await ConversationService.markMessagesAsRead(conversationId, userId);
    SendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: 'Messages marked as read successfully',
        data: null,
    });
});


export const ConversationController = {
    createConversation,
    sendMessage,
    getConversationsForUser,
    getMessagesForConversation,
    markMessagesAsRead,
};
