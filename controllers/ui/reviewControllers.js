import Review from '../../models/review.js';
import Book from '../../models/book.js';

export const addReview = async (req, res) => {
  const { isbn } = req.params;
  const { rating, comment } = req.body;
  const userId = req.session.user?._id;

  try {
    const book = await Book.findOne({ isbn });
    if (!book) return res.status(404).send('Book not found.');

    await Review.findOneAndUpdate(
      { bookId: book._id, userId }, // search on user and book
      {
        rating: parseInt(rating, 10),
        comment,
      },
      {
        upsert: true, // if doesn't exist creates it
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.redirect(`/books/${isbn}`);
  } catch (err) {
    console.error('Error while saving review:', err);
    return res.status(500).send('Saving review unsuccesfull.');
  }
};

export const deleteReview = async (req, res) => {
  const { isbn } = req.params;
  const loggedInUserId = req.session.user?._id;
  const targetUserId = req.body.reviewUserId || loggedInUserId; // review writer

  try {
    const book = await Book.findOne({ isbn });
    if (!book) return res.status(404).send('Book not found.');

    const isSelf = String(loggedInUserId) === String(targetUserId);
    const isModerator = req.session.user.role === 'admin' || req.session.user.role === 'curator';

    if (!isSelf && !isModerator) {
      return res.status(403).send('You can not delete reviews from other users.');
    }

    await Review.deleteOne({ bookId: book._id, userId: targetUserId });

    return res.redirect(`/books/${isbn}`);
  } catch (err) {
    console.error('Error while deleting review:', err);
    return res.status(500).send('Deleting review unsiccesfull.');
  }
};
