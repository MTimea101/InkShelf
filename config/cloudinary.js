import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  // eslint-disable-next-line camelcase
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // eslint-disable-next-line camelcase
  api_key: process.env.CLOUDINARY_API_KEY,
  // eslint-disable-next-line camelcase
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
