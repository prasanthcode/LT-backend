// const categoryModel=require("./categoryModel")
// const mongoose=require("mongoose");

import categoryModel from "./categoryModel.js";

import mongoose from "mongoose";


const sellerSchema = new mongoose.Schema({
    name: { type: String},
    address: { type: String},
    contact: { type: String}
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
    sellers: [sellerSchema],
    categoryId:{
        type:mongoose.Types.ObjectId,
        ref:categoryModel
    }
  });


  const productModel=mongoose.model("product",productSchema)

export default productModel;