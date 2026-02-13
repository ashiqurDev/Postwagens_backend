import express from 'express';
import { ConversationController } from './conversation.controller';
import { checkAuth } from '../../middlewares/auth.middleware';
import { Role } from '../users/user.interface';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.post(
  '/',
  checkAuth(...Object.values(Role)),
  ConversationController.createConversation,
);

router.get(
  '/',
  checkAuth(...Object.values(Role)),
  ConversationController.getConversationsForUser,
);

router.get(
  '/:conversationId/messages',
  checkAuth(...Object.values(Role)),
  ConversationController.getMessagesForConversation,
);

router.post(
  '/:conversationId/messages',
  checkAuth(...Object.values(Role)),
  multerUpload.single('media'),
  ConversationController.sendMessage,
);

router.patch(
  '/:conversationId/read',
  checkAuth(...Object.values(Role)),
  ConversationController.markMessagesAsRead,
);

export const ConversationRoutes = router;
