import Book from '../../models/book.js';
import cloudinary from '../../config/cloudinary.js';

const normalizeCategories = (categoriesString) => {
  if (!categoriesString) return [];

  return categoriesString
    .split(',')
    .map((cat) => {
      const trimmed = cat.trim();
      // Capitalize first letter, rest lowercase for consistency
      return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase() : '';
    })
    .filter((cat) => cat.length > 0);
};

export const handleBookUpload = async (req, res) => {
  const { isbn, title, author, year, summary, copies, categories } = req.body;

  try {
    // Check if ISBN already exists
    const existing = await Book.findOne({ isbn });
    if (existing) {
      return res.render('books/addBook', { error: 'This ISBN already exists!' });
    }

    const normalizedCategories = normalizeCategories(categories);
    let coverUrl = '';

    // Handle image upload
    if (req.file) {
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'library/covers', // Organize in folders
          // eslint-disable-next-line camelcase
          public_id: `book_${isbn}_${Date.now()}`, // Unique identifier
          transformation: [
            { width: 400, height: 600, crop: 'fill', quality: 'auto' }, // Optimize automatically
            { format: 'auto' }, // Auto format (WebP for modern browsers)
          ],
          overwrite: false, // Don't overwrite existing files
          // eslint-disable-next-line camelcase
          resource_type: 'image',
        });

        coverUrl = result.secure_url;
        console.log('Image uploaded to Cloudinary:', result.secure_url);
      } catch (cloudinaryError) {
        console.error('Cloudinary upload failed:', cloudinaryError);

        // Fallback to local storage
        coverUrl = req.file.filename;
        console.log('Falling back to local storage:', coverUrl);
      }
    }

    // Create new book
    const newBook = new Book({
      isbn,
      title,
      author,
      year: parseInt(year, 10),
      summary,
      copies: parseInt(copies, 10),
      cover: coverUrl, // This will be either Cloudinary URL or local filename
      categories: normalizedCategories,
    });

    await newBook.save();
    return res.redirect('/');
  } catch (error) {
    console.error('Book upload error:', error);
    return res.render('addBook', { error: 'Error occurred while saving!' });
  }
};
