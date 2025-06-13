import User from '../../models/user.js';
import Borrow from '../../models/borrow.js';
import Book from '../../models/book.js';
import Note from '../../models/note.js';
import Review from '../../models/review.js';

export const renderAdminPage = async (req, res) => {
  try {
    const [userCount, bookCount, borrowCount, activeBorrowCount, wishlistAgg] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Borrow.countDocuments(),
      Borrow.countDocuments({ returnDate: { $exists: false } }),
      User.aggregate([
        { $unwind: '$wishlist' },
        { $group: { _id: '$wishlist', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: '_id',
            as: 'book',
          },
        },
        { $unwind: '$book' },
      ]),
    ]);

    const topBorrowedBooks = await Borrow.aggregate([
      { $group: { _id: '$bookId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book',
        },
      },
      { $unwind: '$book' },
    ]);

    const borrowedBookIds = await Borrow.distinct('bookId');
    const neverBorrowedBooks = await Book.find({ _id: { $nin: borrowedBookIds } })
      .limit(10)
      .lean();
    const users = await User.find().lean();

    res.render('admin/adminDashboard', {
      users,
      user: req.session.user,
      userCount,
      bookCount,
      borrowCount,
      activeBorrowCount,
      topBorrowedBooks,
      neverBorrowedBooks,
      popularWishlistBooks: wishlistAgg,
    });
  } catch (err) {
    console.error('Error at loading stats:', err);
    res.status(500).send('Error at loading admin stats.');
  }
};

export const updateUserRole = async (req, res) => {
  const { userId, role } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { role });
    res.redirect('/admin');
  } catch {
    res.status(500).send('Error when changing someones role.');
  }
};

export const deleteUser = async (req, res) => {
  const { userId: id } = req.body;

  if (id === req.session.user._id) {
    return res.status(400).send('You can not delete yourself.');
  }

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send('User not found.');
    if (user.role === 'admin') {
      return res.status(400).send('You can not delete the admin.');
    }

    // return books
    const borrows = await Borrow.find({ userId: id });
    await Promise.all(borrows.map((borrow) => Book.findByIdAndUpdate(borrow.bookId, { $inc: { copies: 1 } })));

    // delete whole borrow
    await Borrow.deleteMany({ userId: id });
    await Review.deleteMany({ userId: id });
    await Note.deleteMany({ userId: id });

    // delete user
    await User.findByIdAndDelete(id);

    return res.redirect('/admin');
  } catch (err) {
    console.error('Error when deleting a user:', err);
    return res.status(500).send('Error when deleting a user.');
  }
};
