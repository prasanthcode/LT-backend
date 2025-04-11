// const districtModel=require("./districtModel")
// const mongoose=require("mongoose");

import mongoose from "mongoose";

import districtModel from "./districtModel.js"

const mongooseSchema=mongoose.Schema

const categorySchema=mongooseSchema({
    name:{
        type:String
    },
    districtId:{
        type:mongoose.Types.ObjectId,
        ref:districtModel
    }
})


const categoryModel=mongoose.model("category",categorySchema);

// module.exports=categoryModel;

export default categoryModel;