import express from 'express';
import { checkJwt } from '../middleware/auth.js';
import {
    getCart,
    addCartProduct,
    updateCartProduct,
    clearCart,
} from '../controllers/cart.js';

const router = express.Router();

router.get('/', checkJwt, getCart);
router.post('/add', checkJwt, addCartProduct);
router.put('/update', checkJwt, updateCartProduct);
router.delete('/clear', checkJwt, clearCart);

export default router;
