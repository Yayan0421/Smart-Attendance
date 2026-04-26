import express from 'express';
import { getUsers, createUser, updateUser, deleteUser, getUserById } from '../controllers/userController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', adminMiddleware, createUser);
router.put('/:id', adminMiddleware, updateUser);
router.delete('/:id', adminMiddleware, deleteUser);

export default router;
