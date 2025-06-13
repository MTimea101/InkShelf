import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAtLeast } from '../middleware/role.js';

import { handleBookUpload } from '../controllers/ui/uploadControllers.js';

const router = new express.Router();

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);
const uploadPath = path.join(currentDirname, '..', 'public', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post('/add-book', requireAtLeast('curator'), upload.single('cover'), handleBookUpload);

export default router;
