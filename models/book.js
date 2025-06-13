import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  cover: {
    type: String,
  },
  copies: {
    type: Number,
    required: true,
  },
  categories: [{ type: String }],
});

const Book = mongoose.model('Book', BookSchema);
export default Book;
