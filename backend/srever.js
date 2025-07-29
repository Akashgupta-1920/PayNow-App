import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import razorpayRoutes from './routes/razorpay.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/payment', razorpayRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
