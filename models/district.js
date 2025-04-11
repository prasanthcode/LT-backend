import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema({
  name: { type: String },
  address: { type: String },
  contact: { type: String }
});

const productSchema = new mongoose.Schema({
  name: String,
  desc: String,
  cost: String,
  url: String,
  quantity: String,
  location: {
    lat: Number,
    long: Number,
  },
  address: String,
  sellers: Array,
});

const districtSchema = new mongoose.Schema({
  id: Number,
  name: String,
  products: {
    foods: [productSchema],
    artsAndCrafts: [productSchema],
    fashionAndApparel: [productSchema],
    healthAndWellness: [productSchema],
    homeDecorAndFurnishing: [productSchema],
  },
});

const District = mongoose.model('District', districtSchema);

export default District;
