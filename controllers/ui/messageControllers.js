import Message from '../../models/message.js';
import Book from '../../models/book.js';
import User from '../../models/user.js';
import Borrow from '../../models/borrow.js';

// send message
export const renderSendMessageForm = async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await Book.findOne({ isbn }).lean();

    if (!book) {
      return res.status(404).send('Book not found.');
    }

    // current borrowers
    const activeBorrows = await Borrow.find({
      bookId: book._id,
      returnDate: { $exists: false },
    })
      .populate('userId')
      .lean();

    if (activeBorrows.length === 0) {
      return res.redirect(`/books/${isbn}?error=No active borrowers found.`);
    }

    return res.render('messages/sendMessage', {
      book,
      borrowers: activeBorrows,
      user: req.session.user,
      error: null,
    });
  } catch (err) {
    console.error('Error in the message sending form:', err);
    return res.status(500).send('Error while sending message in form.');
  }
};

// send message
export const sendMessage = async (req, res) => {
  const { isbn } = req.params;
  try {
    const { receiverId, subject, content } = req.body;
    const senderId = req.session.user._id;

    // validation
    if (!receiverId || !subject || !content) {
      return res.redirect(`/books/${isbn}/send-message?error=All fields required.`);
    }

    if (subject.length > 200 || content.length > 1000) {
      return res.redirect(`/books/${isbn}/send-message?error=Message too long.`);
    }

    // book and recipient check
    const book = await Book.findOne({ isbn });
    const receiver = await User.findById(receiverId);

    if (!book || !receiver) {
      return res.redirect(`/books/${isbn}/send-message?error=Invalid data.`);
    }

    // check if recipient really borrowed the book
    const activeBorrow = await Borrow.findOne({
      bookId: book._id,
      userId: receiverId,
      returnDate: { $exists: false },
    });

    if (!activeBorrow) {
      return res.redirect(`/books/${isbn}/send-message?error=User doesn't have this book.`);
    }

    // save message
    await Message.create({
      senderId,
      receiverId,
      bookId: book._id,
      subject,
      content,
    });

    return res.redirect(`/books/${isbn}?message=Message sent successfully!`);
  } catch (err) {
    console.error('Error while sending message:', err);
    return res.redirect(`/books/${isbn}/send-message?error=Error sending message.`);
  }
};

// profile messages
export const renderProfileMessages = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const messages = await Message.find({ receiverId: userId })
      .populate('senderId', 'name email')
      .populate('bookId', 'title isbn')
      .sort({ createdAt: -1 })
      .lean();

    // unread messages
    const unreadCount = messages.filter((m) => !m.isRead).length;
    const replyMap = {};

    const replies = await Message.find({ originalMessageId: { $in: messages.map((m) => m._id) } }).lean();
    replies.forEach((r) => {
      replyMap[r.originalMessageId.toString()] = true;
    });

    res.render('profile/profileMessages', {
      messages,
      unreadCount,
      user: req.session.user,
      hasReply: replyMap,
    });
  } catch (err) {
    console.error('Error in profile messages:', err);
    res.status(500).send('Error when loading messages.');
  }
};

// mark as read
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.session.user._id;

    await Message.findOneAndUpdate({ _id: messageId, receiverId: userId }, { isRead: true });

    res.redirect('/profile/messages');
  } catch (err) {
    console.error('Error when marking as read:', err);
    res.status(500).send('Error when marking as read.');
  }
};

// delete message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.session.user._id;

    await Message.findOneAndDelete({
      _id: messageId,
      receiverId: userId,
    });

    res.redirect('/profile/messages');
  } catch (err) {
    console.error('Error when deleting message:', err);
    res.status(500).send('Error when deleting message.');
  }
};

// get nr of unread messages
export const getUnreadCount = async (userId) => {
  try {
    return await Message.countDocuments({
      receiverId: userId,
      isRead: false,
    });
  } catch (err) {
    console.error('Error when getting the number of unread messages:', err);
    return 0;
  }
};

export const sendReplyMessage = async (req, res) => {
  try {
    const originalMessage = await Message.findById(req.params.id).populate('senderId');
    if (!originalMessage) return res.status(404).send('Original messages not found.');

    const reply = new Message({
      senderId: req.session.user._id,
      receiverId: originalMessage.senderId._id,
      bookId: originalMessage.bookId || null,
      subject: req.body.subject,
      content: req.body.content,
      originalMessageId: originalMessage._id,
      isRead: false,
    });

    await reply.save();
    return res.redirect('/profile/messages');
  } catch (err) {
    console.error('Error when replying:', err);
    return res.status(500).send('Sending reply unsuccesfull.');
  }
};
