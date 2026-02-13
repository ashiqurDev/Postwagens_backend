import { Schema, model } from 'mongoose';
import { IMessage } from './message.interface';

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    text: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'sentAt', updatedAt: false },
  },
);

export const Message = model<IMessage>('Message', messageSchema);
