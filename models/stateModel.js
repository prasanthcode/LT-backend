// const countryModel=require("./countryModel")
// const mongoose=require("mongoose");


import countryModel from "./countryModel.js";

import mongoose from "mongoose";

const mongooseSchema=mongoose.Schema

const stateSchema=mongooseSchema({
    name:{
        type:String
    },
    countryId:{
        type:mongoose.Types.ObjectId,
        ref:countryModel,
        required:true
    }
})


const stateModel=mongoose.model("state",stateSchema);

export default stateModel;