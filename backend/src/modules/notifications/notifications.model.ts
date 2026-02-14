import { Schema, model } from 'mongoose';
import {
  INotification,
  NotificationModel,
  NotificationTargetRole,
  NotificationType,
} from './notifications.interface';

const notificationSchema = new Schema<INotification, NotificationModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    targetRole: {
      type: String,
      enum: Object.values(NotificationTargetRole),
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    entity: {
      type: Object,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Notification = model<INotification, NotificationModel>(
  'Notification',
  notificationSchema,
);
