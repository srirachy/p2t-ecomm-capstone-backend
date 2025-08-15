import express from 'express';
import { checkJwt } from '../middleware/auth.js';
import {
    backendProxy,
    createCheckoutSession,
} from '../controllers/payment.js';

const router = express.Router();

router.get('/stripe-callback', backendProxy);
router.post('/create-checkout-session', checkJwt, createCheckoutSession);

export default router;
