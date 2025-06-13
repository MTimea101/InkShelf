import mongoose from 'mongoose';

const BorrowSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
    alias: 'borrow_date',
  },
  returnDate: {
    type: Date,
    alias: 'return_date',
  },
});

const Borrow = mongoose.model('Borrow', BorrowSchema);
export default Borrow;
