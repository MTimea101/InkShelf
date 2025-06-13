import Book from '../../models/book.js';
import Borrow from '../../models/borrow.js';
import Review from '../../models/review.js';
import Note from '../../models/note.js';
import { imageUrl, getResponsiveImages } from '../../utils/imageHelper.js';

const renderBookPage = (res, { book, borrows, reviews, note, user, request, message = null, error = null }) => {
  return res.render('books/bookDetails', {
    book,
    borrows,
    reviews,
    note,
    user,
    request,
    message,
    error,
    imageUrl,
    getResponsiveImages,
  });
};

// render book details
export const renderBookDetails = async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn }).lean();
    const borrows = await Borrow.find({ bookId: book._id }).populate('userId').lean(); // the object not just the ID
    const rawReviews = await Review.find({ bookId: book._id }).populate('userId').lean();
    const reviews = rawReviews.filter((r) => r.userId); // filteres null user

    const note = await Note.findOne({
      userId: req.session.user?._id,
      bookId: book._id,
    });

    return renderBookPage(res, {
      book,
      borrows,
      reviews,
      note,
      user: req.session.user,
      request: req,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Hiba a könyv részleteinek lekérésekor.');
  }
};

const fetchBookData = async (isbn, userId) => {
  const book = await Book.findOne({ isbn });
  const borrows = await Borrow.find({ bookId: book._id }).populate('userId').lean();
  const reviews = await Review.find({ bookId: book._id }).populate('userId').lean();
  const note = await Note.findOne({ userId, bookId: book._id });

  return { book, borrows, reviews, note };
};

const handleBorrow = async ({ book, userId }) => {
  book.copies -= 1;
  await book.save();
  await Borrow.create({ bookId: book._id, userId });
};

const handleReturn = async ({ book, userId }) => {
  const borrowEntry = await Borrow.findOne({
    bookId: book._id,
    userId,
    returnDate: { $exists: false }, // only aktive borrows
  });

  if (!borrowEntry) return null;
  borrowEntry.returnDate = new Date();
  await borrowEntry.save();

  book.copies += 1;
  await book.save();
  return borrowEntry;
};

// borrow / return
export const handleBorrowAction = async (req, res) => {
  const { action } = req.body;
  const userId = req.session.user?._id;

  try {
    const { book, borrows, reviews, note } = await fetchBookData(req.params.isbn, userId);

    if (!userId || !['borrow', 'return'].includes(action)) {
      return renderBookPage(res, {
        book,
        borrows,
        reviews,
        note,
        user: req.session.user,
        request: req,
        error: 'Incorrect data!',
      });
    }

    if (action === 'borrow') {
      if (book.copies < 1) {
        return renderBookPage(res, {
          book,
          borrows,
          reviews,
          note,
          user: req.session.user,
          request: req,
          error: 'No more copies available!',
        });
      }

      const alreadyBorrowed = await Borrow.findOne({
        bookId: book._id,
        userId,
        returnDate: { $exists: false }, // only active borrows
      });

      if (alreadyBorrowed) {
        return renderBookPage(res, {
          book,
          borrows,
          reviews,
          note,
          user: req.session.user,
          request: req,
          error: 'You have already borrowed this book.',
        });
      }

      await handleBorrow({ book, userId });

      return renderBookPage(res, {
        book,
        borrows: await Borrow.find({ bookId: book._id }).populate('userId').lean(),
        reviews,
        note,
        user: req.session.user,
        request: req,
        message: 'You borrowed this book successfully!',
      });
    }
    // return
    const result = await handleReturn({ book, userId });
    if (!result) {
      return renderBookPage(res, {
        book,
        borrows,
        reviews,
        note,
        user: req.session.user,
        request: req,
        error: 'You did not borrow this book!',
      });
    }
    return res.redirect(`/books/${book.isbn}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error while trying to return a book.');
  }
};

// my borrows
export const renderMyBorrows = async (req, res) => {
  try {
    const borrows = await Borrow.find({ userId: req.session.user._id }).populate('bookId').lean();

    res.render('borrows/myBorrows', {
      borrows,
      user: req.session.user,
    });
  } catch {
    res.status(500).send('Error accessing myBorrows.');
  }
};
