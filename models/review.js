import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true }); // egy user csak egy review-t írhat egy könyvhöz

export default mongoose.model('Review', reviewSchema);
