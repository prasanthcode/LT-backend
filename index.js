import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from './models/orderModel.js';
dotenv.config();

import authRoutes from './routes/auth.js';
import districtRoutes from './routes/district.js';
import countryRoutes from './routes/country.js';


const PORT = process.env.PORT || 5000;
const app = express();
const allowedOrigins = ['*'];
// app.use(cors({
//   origin: 'http://localhost:3000', 
//   methods: 'GET,POST,PUT,DELETE', 
//   allowedHeaders: 'Content-Type,Authorization' 
// }));
// app.use(cors());

// app.use(cors({
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.post("/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: "rzp_test_pnqesD1bWPOsNm",
      key_secret:"ThGU0itoGMUGidvtmbgYv12C"
    });
    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error creating order");
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

app.post('/order/validate', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sha = crypto.createHmac("sha256", "ThGU0itoGMUGidvtmbgYv12C");
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const signature = sha.digest("hex");

  if (signature !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id
  });
}); 

app.post('/offline', async (req, res) => {
  try {
    const { name, email, phone, address, pincode, paymentMethod, amount } = req.body;
    if (!name || !email || !phone || !address || !pincode || !paymentMethod || !amount) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newOrder = new Order({
      name,
      email,
      phone,
      address,
      pincode,
      paymentMethod,
      amount
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error });
  }
});


// Routes
app.use('/auth', authRoutes);
app.use('/district', districtRoutes);
app.use('/',countryRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON received:', err);
    return res.status(400).json({ error: 'Bad Request', message: 'Invalid JSON' });
  }
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });



