import { getSocketIo, isUserOnline } from '../../socket/socket';
import { INotification } from './notifications.interface';
import { Notification } from './notifications.model';
import User from '../users/user.model';
import fcm  from '../../config/firebase.config';

const getNotificationMessage = (notification: INotification) => {
    let title = 'New Notification';
    let body = 'You have a new notification';

    switch (notification.type) {
        case 'like':
            title = 'New Like';
            body = 'Someone liked your post';
            break;
        case 'comment':
            title = 'New Comment';
            body = 'Someone commented on your post';
            break;
        case 'follow':
            title = 'New Follower';
            body = 'Someone started following you';
            break;
        // Add more cases for other notification types
    }

    return { title, body };
}


const createNotification = async (payload: INotification) => {
  const notification = await Notification.create(payload);

  if (notification.userId) {
    const userId = notification.userId.toString();
    if (isUserOnline(userId)) {
      const io = getSocketIo();
      io.to(userId).emit('new_notification', notification);
    } else {
      const user = await User.findById(userId);
      if (user && user.fcmToken) {
        const { title, body } = getNotificationMessage(notification);
        const message = {
          notification: {
            title,
            body,
          },
          token: user.fcmToken,
          data: {
            notification: JSON.stringify(notification),
          }
        };
        
        try {
          // @ts-ignore
          await fcm.send(message);
        } catch (error) {
          console.error('Error sending FCM message:', error);
        }
      }
    }
  }
  
  return notification;
};

const getNotificationsForUser = async (userId: string) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
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
