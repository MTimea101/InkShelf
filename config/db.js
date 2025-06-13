import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas csatlakozva!');
  } catch (error) {
    console.error('Adatbázis csatlakozási hiba:', error.message);
    process.exit(1); // kilépés ha hiba van
  }
};

export default connectDB;
