import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { uploadBufferToCloudinary } from '../../config/cloudinary.config';
import { Conversation } from './conversation.model';
import { getSocketIo } from '../../socket/socket';
import { Message } from './message.model';
import mongoose from 'mongoose';

const createConversation = async (
  participantAId: string,
  participantBId: string,
) => {
  // Check if a conversation already exists between the two users
  const existingConversation = await Conversation.findOne({
    $or: [
      { participantAId, participantBId },
      { participantAId: participantBId, participantBId: participantAId },
    ],
  });

  if (existingConversation) {
    return existingConversation;
  }

  const conversation = await Conversation.create({
    participantAId,
    participantBId,
  });
  return conversation;
};

const sendMessage = async (
  conversationId: string,
  senderId: string,
  text?: string,
  file?: Express.Multer.File,
) => {
  if (!text && !file) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Message text or media is required');
  }
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Conversation not found');
  }

  if (
    conversation.participantAId.toString() !== senderId &&
    conversation.participantBId.toString() !== senderId
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not a participant in this conversation',
    );
  }

  let mediaUrl: string | undefined;
  if (file) {
    const uploadResult = await uploadBufferToCloudinary(file.buffer, file.originalname);
    mediaUrl = uploadResult?.secure_url;
  }


  let message = await Message.create({
    conversationId,
    senderId,
    text,
    mediaUrl,
  });

  message = await message.populate('senderId');

  const io = getSocketIo();
  const recipientId =
    conversation.participantAId.toString() === senderId
      ? conversation.participantBId.toString()
      : conversation.participantAId.toString();

  io.to(recipientId).emit('newMessage', message);


  return message;
};

const getConversationsForUser = async (userId: string) => {
    const conversations = await Conversation.find({
        $or: [{ participantAId: userId }, { participantBId: userId }],
    }).populate('participantAId participantBId');
    return conversations;
};

const getMessagesForConversation = async (conversationId: string, userId: string) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Conversation not found');
    }

    if (
        conversation.participantAId.toString() !== userId &&
        conversation.participantBId.toString() !== userId
    ) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            'You are not a participant in this conversation',
        );
    }

    const messages = await Message.find({ conversationId }).sort({ sentAt: 1 });
    return messages;
};

const markMessagesAsRead = async (conversationId: string, userId: string) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        throw new AppError(StatusCodes.NOT_FOUND, 'Conversation not found');
    }

    if (
        conversation.participantAId.toString() !== userId &&
        conversation.participantBId.toString() !== userId
    ) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            'You are not a participant in this conversation',
        );
    }

    await Message.updateMany(
        { conversationId, senderId: { $ne: userId }, readAt: { $exists: false } },
        { readAt: new Date() },
    );

    return null;
};


export const ConversationService = {
  createConversation,
  sendMessage,
  getConversationsForUser,
  getMessagesForConversation,
  markMessagesAsRead,
};
