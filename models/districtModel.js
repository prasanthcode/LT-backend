// const stateModel=require("./stateModel")
// const mongoose=require("mongoose");

import stateModel from "./stateModel.js"
import mongoose from "mongoose";

const mongooseSchema=mongoose.Schema

const districtSchema=mongooseSchema({
    name:{
        type:String
    },
    stateId:{
        type:mongoose.Types.ObjectId,
        ref:stateModel
    }
})


const districtModel=mongoose.model("district",districtSchema);

// module.exports=districtModel;
export default districtModel;
