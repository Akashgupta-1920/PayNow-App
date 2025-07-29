// routes/razorpay.js
import express from 'express';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount, // already in paise from frontend
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ error: 'Order creation failed' });
  }
});

export default router;
