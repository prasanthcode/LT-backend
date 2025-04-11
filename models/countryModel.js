// const mongoose=require('mongoose');
import mongoose from "mongoose";
const mongooseSchema=mongoose.Schema

const countrySchema=mongooseSchema(
    {
        name:{
            type:String
        }
    }
)

const countryModel=mongoose.model('country',countrySchema)

// module.exports=countryModel;
export default countryModel;