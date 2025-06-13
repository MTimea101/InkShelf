import User from '../../models/user.js';
import bcrypt from 'bcrypt';
import { getUnreadCount } from './messageControllers.js';

export const renderProfilePage = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).lean();
    const unreadMessages = await getUnreadCount(req.session.user._id);

    res.render('profile/profile', {
      user,
      unreadMessages,
      message: null,
      error: null,
    });
  } catch (err) {
    console.error('Profile page loading error:', err);
    res.status(500).send('Error loading profile.');
  }
};

export const updateProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    // Email uniqueness check (excluding current user)
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.session.user._id },
    });

    if (existingUser) {
      const unreadMessages = await getUnreadCount(req.session.user._id);
      return res.render('profile', {
        user: req.session.user,
        unreadMessages,
        message: null,
        error: 'This email is already in use.',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.session.user._id, { name, email }, { new: true, lean: true });

    return req.session.save(() => {
      req.session.user.name = updatedUser.name;
      req.session.user.email = updatedUser.email;

      return res.render('profile/profile', {
        user: req.session.user,
        unreadMessages: 0,
        message: 'Profile updated successfully.',
        error: null,
      });
    });
  } catch (err) {
    console.error('Profile update error:', err);
    const unreadMessages = await getUnreadCount(req.session.user._id);
    return res.render('profile/profile', {
      user: req.session.user,
      unreadMessages,
      message: null,
      error: 'Error while updating profile.',
    });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      const unreadMessages = await getUnreadCount(req.session.user._id);
      return res.render('profile/profile', {
        user: req.session.user,
        unreadMessages,
        message: null,
        error: 'All password fields are required.',
      });
    }

    if (newPassword.length < 6) {
      const unreadMessages = await getUnreadCount(req.session.user._id);
      return res.render('profile/profile', {
        user: req.session.user,
        unreadMessages,
        message: null,
        error: 'New password must be at least 6 characters long.',
      });
    }

    if (newPassword !== confirmPassword) {
      const unreadMessages = await getUnreadCount(req.session.user._id);
      return res.render('profile/profile', {
        user: req.session.user,
        unreadMessages,
        message: null,
        error: 'New passwords do not match.',
      });
    }

    // Get current user with password
    const user = await User.findById(req.session.user._id);

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      const unreadMessages = await getUnreadCount(req.session.user._id);
      return res.render('profile/profile', {
        user: req.session.user,
        unreadMessages,
        message: null,
        error: 'Current password is incorrect.',
      });
    }

    // Hash new password and update
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.session.user._id, {
      passwordHash: newPasswordHash,
    });

    const unreadMessages = await getUnreadCount(req.session.user._id);
    return res.render('profile/profile', {
      user: req.session.user,
      unreadMessages,
      message: 'Password updated successfully.',
      error: null,
    });
  } catch (err) {
    console.error('Password update error:', err);
    const unreadMessages = await getUnreadCount(req.session.user._id);
    return res.render('profile/profile', {
      user: req.session.user,
      unreadMessages,
      message: null,
      error: 'Error while updating password.',
    });
  }
};
