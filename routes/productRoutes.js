import express from 'express';
import multer from 'multer';
import { checkJwt, isAdmin } from '../middleware/auth.js';
import { requiredScopes } from 'express-oauth2-jwt-bearer';
import { 
    getProducts, 
    getProduct, 
    getCategory,
    createProduct, 
    updateProduct, 
    deleteProduct
} from '../controllers/productController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// public routes
router.get('/', getProducts);
router.get('/:slug', getProduct);
router.get('/data/category', getCategory);

// admin routes
const checkScopes = requiredScopes('manage:products')
router.post('/', checkJwt, checkScopes, upload.array('images'), isAdmin, createProduct);
router.put('/:id', checkJwt, checkScopes, isAdmin, updateProduct);
router.delete('/:id', checkJwt, checkScopes, isAdmin, deleteProduct);

export default router;
