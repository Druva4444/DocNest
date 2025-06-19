import Plan from '../Models/Plan.model.js';
import mongoose from 'mongoose';
export async function getPlans(req,res){
    const plans = await Plan.find()
   return  res.status(200).json({plans})
}