import User from '../../models/user.js';
import Borrow from '../../models/borrow.js';
import Book from '../../models/book.js';

// all users for admin panel
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.render('admin/adminDashboard', { users, user: req.session.user });
  } catch {
    res.status(500).send('Error while trying to get users.');
  }
};

// modify role of user
export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    await User.findByIdAndUpdate(id, { role });
    res.redirect('/admin');
  } catch {
    res.status(500).send('Error while modifying a role.');
  }
};

// delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await Borrow.deleteMany({ userId: id });
    await User.findByIdAndDelete(id);
    res.redirect('/admin');
  } catch {
    res.status(500).send('Error while deleting user.');
  }
};

export const addToWishlist = async (req, res) => {
  const userId = req.session.user._id;
  const isbn = req.params.isbn;

  try {
    const book = await Book.findOne({ isbn });
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { wishlist: book._id },
    });

    return res.status(200).json({ message: 'Book added to wishlist.' });
  } catch {
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const renderWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).populate('wishlist');
    res.render('books/wishlist', {
      books: user.wishlist,
      user: req.session.user,
    });
  } catch {
    res.status(500).send('Error while rendering wishlist.');
  }
};

export const removeFromWishlist = async (req, res) => {
  const { isbn } = req.params;
  const userId = req.session.user._id;

  try {
    const book = await Book.findOne({ isbn });
    if (!book) return res.status(404).send('Book not found.');

    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: book._id },
    });

    return res.redirect('/wishlist');
  } catch (err) {
    console.error('Error while deleting wishlisted item:', err);
    return res.status(500).send('Could not delete from wishlist.');
  }
};
