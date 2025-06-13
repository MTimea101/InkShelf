import bcrypt from 'bcrypt';
import User from '../../models/user.js';

export const renderLoginPage = (req, res) => {
  res.render('auth/login', { error: null });
};

export const renderRegisterPage = (req, res) => {
  res.render('auth/register', { error: null });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('auth/login', { error: 'Please fill in every field!' });
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.render('auth/login', { error: 'Incorrect login credentials!' });
  }

  const sessionUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  await new Promise((resolve, reject) => {
    req.session.user = sessionUser;
    req.session.save((err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  return res.redirect(user.role === 'admin' ? '/admin' : '/');
};

export const logoutUser = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.render('auth/register', { error: 'Please fill in every field.' });
  }

  if (password.length < 6) {
    return res.render('auth/register', { error: 'The password must be at least 6 characters long.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { error: 'This email is already in use.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email, passwordHash });

    return res.redirect('/login');
  } catch (err) {
    console.error('An error occurred during registration:', err);
    return res.render('auth/register', { error: 'An error occurred during registration.' });
  }
};
