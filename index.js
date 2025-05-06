import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
// import userRoutes from './routes/userRoutes.js'

dotenv.config();

const app = express();

const corspolicy = {
    'origin': process.env.FRONTEND_URI,
} //allow origin

app.use(cors(corspolicy));
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('API is running');
});

// app.use('/users', userRoutes);
// app.use('/admin/users', userRoutes); // likely no need after redirect

const PORT = process.env.PORT || 5000;
const DEPLOYED_URI = process.env.DEPLOYED_URI;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on ${DEPLOYED_URI ? DEPLOYED_URI : `http://localhost:${PORT}`}`);
});
