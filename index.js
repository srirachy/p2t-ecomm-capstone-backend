import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { 
    auth, 
    // requiredScopes, 
} from 'express-oauth2-jwt-bearer'
import { 
    validateAuth0ApiKey,
    // checkJwt,
    // isAdmin,
} from './middleware/auth.js';
import userRoutes from './routes/userRoutes.js'

const app = express();

const corspolicy = {
    'origin': process.env.FRONTEND_URI,
} //allow origin

app.use(cors(corspolicy));
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('API is running');
});

// const checkScopes = requiredScopes('read:products');
// app.get('/api/manage-product', checkJwt, requiredScopes('manage:products'), isAdmin, (_req, res) => {
//     res.json('admin access granted! you have ability to manage product!');
// });

app.use('/users', validateAuth0ApiKey, userRoutes);

const PORT = process.env.PORT || 5000;
const DEPLOYED_URI = process.env.DEPLOYED_URI;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on ${DEPLOYED_URI ? DEPLOYED_URI : `http://localhost:${PORT}`}`);
});
