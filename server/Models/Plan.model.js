import mongoose from "mongoose";
const planSchema =new  mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    support:{
        type:String,
    },
    stripeprice: String,
})
const plan = mongoose.model("plan",planSchema)
export default plan