import Note from '../../models/note.js';
import Book from '../../models/book.js';

export const saveNote = async (req, res) => {
  const { isbn } = req.params;
  const { text } = req.body;
  const userId = req.session.user._id;

  try {
    const book = await Book.findOne({ isbn });
    if (!book) return res.status(404).send('Könyv nem található.');

    await Note.findOneAndUpdate({ userId, bookId: book._id }, { text }, { upsert: true, new: true });

    return res.redirect(`/books/${isbn}`);
  } catch (err) {
    console.error('Jegyzet mentési hiba:', err);
    return res.status(500).send('Nem sikerült menteni a jegyzetet.');
  }
};
