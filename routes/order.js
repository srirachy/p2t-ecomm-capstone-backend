import express from 'express';
import { checkJwt, isAdmin } from '../middleware/auth.js';
import { requiredScopes } from 'express-oauth2-jwt-bearer';
import {
    createOrder,
    getUserOrders,
    getOrderById,
    getAllOrders,
    updateOrderDeliver,
} from '../controllers/order.js';

const router = express.Router();
// public routes
router.post('/:sessionid/:userid', createOrder);
router.get('/:id', checkJwt, getOrderById);
router.get('/myorders', checkJwt, getUserOrders);

// admin routes
const checkScopes = requiredScopes('manage:orders');
router.get('/', checkJwt, checkScopes, isAdmin, getAllOrders); // get all orders
router.put('/:id/deliver', checkJwt, checkScopes, isAdmin, updateOrderDeliver); // update order to delivered

export default router;
