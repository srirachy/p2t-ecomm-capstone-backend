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
router.get('/myorders', checkJwt, getUserOrders);
router.get('/myorders/:id', checkJwt, getOrderById);
router.post('/create-order/:id', checkJwt, createOrder);

// admin routes
const checkScopes = requiredScopes('manage:orders');
router.get('/', checkJwt, checkScopes, isAdmin, getAllOrders); // get all orders
router.put('/update-orders', checkJwt, checkScopes, isAdmin, updateOrderDeliver); // update order to delivered

export default router;
