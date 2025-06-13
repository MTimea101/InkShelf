import Book from '../../models/book.js';
import Message from '../../models/message.js';
import Review from '../../models/review.js';
import Note from '../../models/note.js';
import Borrow from '../../models/borrow.js';
import User from '../../models/user.js';
import { imageUrl, getResponsiveImages, isCloudinaryImage, extractPublicId } from '../../utils/imageHelper.js';
import cloudinary from '../../config/cloudinary.js';

function buildBookFilter(query) {
  const { title, author, minYear, maxYear, availableOnly, category } = query;
  const filter = {};

  if (title) filter.title = { $regex: title, $options: 'i' };
  if (author) filter.author = { $regex: author, $options: 'i' };
  if (minYear) filter.year = { ...filter.year, $gte: parseInt(minYear, 10) };
  if (maxYear) filter.year = { ...filter.year, $lte: parseInt(maxYear, 10) };
  if (availableOnly === 'on') filter.copies = { $gt: 0 };
  if (category) {
    const escapedCategory = category.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
    filter.categories = {
      $elemMatch: {
        $regex: `^${escapedCategory}$`,
        $options: 'iu',
      },
    };
  }

  return filter;
}

export const renderIndexPage = async (req, res) => {
  try {
    const filter = buildBookFilter(req.query);
    const rawBooks = await Book.find(filter).lean();
    const categories = await Book.distinct('categories');

    // Process books to include image URLs
    const books = rawBooks.map((book) => ({
      ...book,
      coverUrl: imageUrl(book.cover),
      responsiveImages: getResponsiveImages(book.cover),
    }));

    const booksByCategory = {};
    const isFiltered = Object.keys(filter).length > 0;

    if (!isFiltered) {
      for (const category of categories) {
        booksByCategory[category] = books.filter((book) => book.categories?.includes(category));
      }
    }

    res.render('books/index', {
      books,
      booksByCategory,
      categories,
      query: req.query,
      selectedCategory: req.query.category || '',
      error: null,
      imageUrl,
    });
  } catch (err) {
    console.error(err);
    res.render('index', {
      books: [],
      booksByCategory: {},
      categories: [],
      query: req.query,
      selectedCategory: '',
      error: 'Hiba a könyvek lekérésekor.',
      imageUrl,
    });
  }
};

export const renderAddBookPage = (req, res) => {
  return res.render('books/addBook', { error: null });
};

export const deleteBook = async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await Book.findOne({ isbn });

    if (!book) return res.status(404).send('A könyv nem található.');

    if (isCloudinaryImage(book.cover)) {
      const publicId = extractPublicId(book.cover);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Review.deleteMany({ bookId: book._id });
    await Note.deleteMany({ bookId: book._id });
    await Borrow.deleteMany({ bookId: book._id });
    await User.updateMany({}, { $pull: { wishlist: book._id } });
    await Message.deleteMany({ bookId: book._id });

    await book.deleteOne();

    return res.redirect('/');
  } catch (err) {
    console.error('Könyv törlés hiba:', err);
    return res.status(500).send('Hiba történt a könyv törlésekor.');
  }
};
