import { Types } from 'mongoose';

export interface IMessage {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  text?: string;
  mediaUrl?: string;
  sentAt: Date;
  readAt?: Date;
}

