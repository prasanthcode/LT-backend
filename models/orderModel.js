// const mongoose=require('mongoose');
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  amount: { type: Number, required: true },
  orderId: { type: String },
  paymentId: { type: String }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema)
export default  OrderModel;