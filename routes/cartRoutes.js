import express from 'express';
import { checkJwt } from '../middleware/auth.js';
import {
    getCart,
    addCartProduct,
    updateCartProduct,
    clearCart,
    mergeCarts
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', checkJwt, getCart);
router.post('/add', checkJwt, addCartProduct);
router.put('/update', checkJwt, updateCartProduct);
router.put('/clear', checkJwt, clearCart);
router.put('/merge', checkJwt, mergeCarts);

export default router;