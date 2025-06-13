import express from 'express';
import { requireAdmin } from '../middleware/isAdmin.js';
import { renderAdminPage, updateUserRole, deleteUser } from '../controllers/ui/adminControllers.js';

const router = new express.Router();

router.get('/admin', requireAdmin, renderAdminPage);
router.post('/admin/update-role', requireAdmin, updateUserRole);
router.post('/admin/delete-user', requireAdmin, deleteUser);

export default router;
