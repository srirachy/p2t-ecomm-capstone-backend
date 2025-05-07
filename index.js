import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer'
// import userRoutes from './routes/userRoutes.js'

dotenv.config();

const app = express();

const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_BASE_URL,
    tokenSigningAlg: 'RS256'
});
const corspolicy = {
    'origin': process.env.FRONTEND_URI,
} //allow origin

app.use(cors(corspolicy));
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('API is running');
});

app.get('/api/private', checkJwt, (_req, res) => {
    res.json({
        message: 'hello from private endpoint! you need to be authenticated to see this'
    })
});

const checkScopes = requiredScopes('read:products');

app.get('/api/private-scoped', checkJwt, checkScopes, (_req, res) => {
    res.json('hello from private endpoint! you need auth and scope to read this!');
});

app.get('/authorized', function (req, res) {
    res.send('Secured Resource');
});

// app.use('/users', userRoutes);
// app.use('/admin/users', userRoutes); // likely no need after redirect

const PORT = process.env.PORT || 5000;
const DEPLOYED_URI = process.env.DEPLOYED_URI;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on ${DEPLOYED_URI ? DEPLOYED_URI : `http://localhost:${PORT}`}`);
});
