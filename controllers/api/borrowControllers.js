import Borrow from '../../models/borrow.js';
import Book from '../../models/book.js';

export const deleteBorrow = async (req, res) => {
  try {
    const borrow = await Borrow.findById(req.params.borrowId);
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow not found.' });
    }

    // Permission Check
    if (String(borrow.userId) !== String(req.session.user._id)) {
      return res.status(403).json({ message: 'Deleting not allowed.' });
    }

    await Borrow.findByIdAndDelete(req.params.borrowId);
    await Book.findByIdAndUpdate(borrow.bookId, { $inc: { copies: 1 } });
    return res.status(200).json({ message: 'Borrowing deleted.' });
  } catch {
    return res.status(500).json({ message: 'Server error.' });
  }
};
