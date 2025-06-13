import Book from '../../models/book.js';

// get books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch {
    res.status(500).json({ message: 'Error while trying to get books' });
  }
};

// get book details
export const getBookByISBN = async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    return res.status(200).json(book);
  } catch {
    return res.status(500).json({ message: 'Error while getting book.' });
  }
};

// add new book
export const createBook = async (req, res) => {
  const { isbn, title, author, year, summary, cover, copies } = req.body;

  try {
    const newBook = new Book({
      isbn,
      title,
      author,
      year,
      summary,
      cover,
      copies,
    });

    await newBook.save();
    res.status(201).json({ message: 'Book added succesfully!' });
  } catch {
    res.status(500).json({ message: 'Error when adding book.' });
  }
};

// delete book
export const deleteBook = async (req, res) => {
  try {
    const result = await Book.findOneAndDelete({ isbn: req.params.isbn });
    if (!result) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    return res.status(200).json({ message: 'Book deleted succesfully.' });
  } catch {
    return res.status(500).json({ message: 'Error when deleting book.' });
  }
};
