import mongoose from "mongoose";
const uploadschema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    filename:{
        type:String,
        required:true
    },
    originalname:{
        type:String,
        required:true

    },
    filetype:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    },
    filesize:{
        type:Number,
        required:true
    }
})
const upload = mongoose.model("upload",uploadschema)
export default upload