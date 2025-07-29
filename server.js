import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js'

const app = express();

const corspolicy = {
    'origin': process.env.FRONTEND_URI,
};

app.use(cors(corspolicy));
app.use(express.json());

app.get('/', (_req, res) => { res.send('Pokécommerce-API is running'); });
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

const PORT = process.env.PORT || 5000;
const DEPLOYED_URI = process.env.DEPLOYED_URI;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on ${DEPLOYED_URI ? DEPLOYED_URI : `http://localhost:${PORT}`}`);
});
