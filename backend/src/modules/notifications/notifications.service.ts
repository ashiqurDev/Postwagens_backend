import { getSocketIo, isUserOnline } from '../../socket/socket';
import { INotification } from './notifications.interface';
import { Notification } from './notifications.model';
import User from '../users/user.model';
import fcm  from '../../config/firebase.config';
import { NotificationHelper } from './notification.helper';


const createNotification = async (payload: INotification) => {
  const notification = await Notification.create(payload);
  const message = await NotificationHelper.generateNotificationMessage(notification);

  if (notification.userId) {
    const userId = notification.userId.toString();
    if (isUserOnline(userId)) {
      const io = getSocketIo();
      io.to(userId).emit('new_notification', {
        ...notification.toObject(),
        message,
      });
    } else {
      const user = await User.findById(userId);
      if (user && user.fcmToken) {
        const fcmMessage = {
          notification: {
            title: 'New Notification',
            body: message,
          },
          token: user.fcmToken,
          data: {
            notification: JSON.stringify(notification),
          }
        };
        
        try {
          // @ts-ignore
          await fcm.send(fcmMessage);
        } catch (error) {
          console.error('Error sending FCM message:', error);
        }
      }
    }
  }
  
  return notification;
};

const getNotificationsForUser = async (userId: string) => {
  const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).lean();
  const notificationsWithMessages = await Promise.all(
    notifications.map(async (notification) => {
      const message = await NotificationHelper.generateNotificationMessage(notification);
      return {
        ...notification,
        message,
      };
    }),
  );
  return notificationsWithMessages;
};

const markAsRead = async (notificationId: string) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true },
  );
};

const markAllAsRead = async (userId: string) => {
    return await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

export const NotificationService = {
  createNotification,
  getNotificationsForUser,
  markAsRead,
  markAllAsRead,
};
