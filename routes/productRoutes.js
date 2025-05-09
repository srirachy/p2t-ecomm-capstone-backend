import express from 'express';
import { checkJwt, isAdmin } from '../middleware/auth.js';
import { requiredScopes } from 'express-oauth2-jwt-bearer';
import { 
    getProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

// public routes
router.get('/', getProducts);
router.get('/:slug', getProduct);

// admin routes
const checkScopes = requiredScopes('manage:products')
router.post('/', checkJwt, checkScopes, isAdmin, createProduct);
router.put('/:id', checkJwt, checkScopes, isAdmin, updateProduct);
router.delete('/:id', checkJwt, checkScopes, isAdmin, deleteProduct);

export default router;
