import express from 'express';
import {
  authUser,
  registerUser,
  checkUser
} from '../controllers/user.js';
import {
  validateAuth0ApiKey,
  checkJwt
} from '../middleware/auth.js';

const router = express.Router();

router.patch('/auth', validateAuth0ApiKey, authUser);
router.post('/register', validateAuth0ApiKey, registerUser);
router.get('/me', checkJwt, checkUser);

export default router;
