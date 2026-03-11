import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/AppError';
import { uploadBufferToCloudinary } from '../../config/cloudinary.config';
import { Conversation } from './conversation.model';
import { getSocketIo } from '../../socket/socket';
import { Message } from './message.model';
import mongoose from 'mongoose';
import Listing from '../listing/listing.model';

const sendMessage = async (
  senderId: string,
  participantBId: string,
  text?: string,
  listingId?: string,
  file?: Express.Multer.File,
) => {
  let conversation = await Conversation.findOne({
    $or: [
      { participantAId: senderId, participantBId: participantBId },
      { participantAId: participantBId, participantBId: senderId },
    ],
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participantAId: senderId,
      participantBId: participantBId,
    });
  }

  if (!text && !file) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Message text or media is required');
  }

  if (listingId) {
    await Listing.findByIdAndUpdate(listingId, {
      $inc: { inquiryCount: 1 },
    });
  }

  let mediaUrl: string | undefined;
  if (file) {
    const uploadResult = await uploadBufferToCloudinary(file.buffer, file.originalname);
    mediaUrl = uploadResult?.secure_url;
  }


  let message = await Message.create({
    conversationId: conversation._id,
    senderId,
    text,
    mediaUrl,
    listing: listingId,
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
    }).populate('participantAId participantBId').lean();

    const conversationsWithUnreadStatus = await Promise.all(
        conversations.map(async (conversation) => {
            const unreadMessagesCount = await Message.countDocuments({
                conversationId: conversation._id,
                senderId: { $ne: userId },
                isRead: false,
            });
            return {
                ...conversation,
                hasUnreadMessages: unreadMessagesCount > 0,
            };
        }),
    );

    return conversationsWithUnreadStatus;
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

    // Mark messages as read for the current user.
    // This will only update messages where the sender is not the current user.
    await Message.updateMany(
        { conversationId, senderId: { $ne: userId }, isRead: false },
        { isRead: true },
    );

    const messages = await Message.find({ conversationId }).sort({ sentAt: 1 });
    return messages;
};

export const ConversationService = {
  sendMessage,
  getConversationsForUser,
  getMessagesForConversation,
};
