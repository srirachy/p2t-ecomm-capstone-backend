import express from 'express';
import { checkJwt, isAdmin } from '../middleware/auth.js';
import {} from '../controllers/order.js';

const router = express.Router();

export default router;