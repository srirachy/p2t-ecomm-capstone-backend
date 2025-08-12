import express from 'express';
import { checkJwt } from '../middleware/auth.js';
import {
    createCheckoutSession,
} from '../controllers/payment.js';

const router = express.Router();

router.post('/create-checkout-session', checkJwt, createCheckoutSession);

export default router;
