import express from 'express';
import {
  authUser,
  registerUser,
} from '../controllers/userController.js';

const router = express.Router();

router.patch('/auth', authUser);
router.post('/register', registerUser);

export default router;
