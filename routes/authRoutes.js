import express from 'express';
import {
  renderLoginPage,
  renderRegisterPage,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/ui/authControllers.js';

const router = new express.Router();

router.get('/login', renderLoginPage);
router.get('/register', renderRegisterPage);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/register', registerUser);

export default router;
