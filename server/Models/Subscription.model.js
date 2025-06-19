import mongoose from "mongoose";
const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    stripeSubscriptionId: {
        type: String,
        required: true
    },
    stripeSubscriptionId: {
        type: String,
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "plan",
        required: true
    },
    status: {
        type:String,
        enum:['active','expired','cancelled'],
        default:'active'
        
    },
    endDate:{
        type:Date,
        required:true
    }

})
const subscription = mongoose.model("subscription",subscriptionSchema)
export default subscription