import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import { injectUser } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import connectDB from './config/db.js';

// routes
import mainRoutes from './routes/mainRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import borrowRoutes from './routes/borrowRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const currentFilename = fileURLToPath(import.meta.url);
const currentDirname = path.dirname(currentFilename);

// connect to mongodb
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(currentDirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'partials/layout');

app.use(express.static(path.join(currentDirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'InkEgeszsegesHIHI',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 ora
      httpOnly: true,
      secure: false,
    },
    rolling: true,
  }),
);

app.use(injectUser);
app.use((req, res, next) => {
  res.locals.request = req;
  next();
});

// using routes
app.use('/', authRoutes);
app.use('/', mainRoutes);
app.use('/', uploadRoutes);
app.use('/', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/', adminRoutes);

app.use('/', borrowRoutes);
app.use('/', reviewRoutes);
app.use('/', noteRoutes);
app.use('/', messageRoutes);

// 404 - not found
app.use((req, res) => {
  res.status(404).render('errors/404');
});

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).render('errors/500', { error: err });
});

// Inditas
app.listen(port, () => {
  console.log(`Szerver fut: http://localhost:${port}`);
});
