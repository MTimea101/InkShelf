import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  renderSendMessageForm,
  sendMessage,
  renderProfileMessages,
  markAsRead,
  deleteMessage,
  sendReplyMessage,
} from '../controllers/ui/messageControllers.js';

const router = new express.Router();

// send message from
router.get('/books/:isbn/send-message', requireAuth, renderSendMessageForm);

// send message
router.post('/books/:isbn/send-message', requireAuth, sendMessage);

// messages on profile
router.get('/profile/messages', requireAuth, renderProfileMessages);

// message marked as read
router.post('/messages/:messageId/mark-read', requireAuth, markAsRead);

// delete message
router.post('/messages/:messageId/delete', requireAuth, deleteMessage);
router.post('/messages/:id/reply', requireAuth, sendReplyMessage);

export default router;
