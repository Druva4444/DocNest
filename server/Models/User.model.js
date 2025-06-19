import mongoose from "mongoose";
import Plan from "./Plan.model.js";
const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    }
    ,
    plan:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"plan",
        default:"68524328a1f8fcd18ada022b"
    },
      usedcapacity: {
        type: Number,
        required: true,
        default: 0 
      }
})
const user = mongoose.model("user",userschema)
export default user
