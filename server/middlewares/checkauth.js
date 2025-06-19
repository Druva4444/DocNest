import User from '../Models/User.model.js'
import Plan from '../Models/Plan.model.js'
import jwt from 'jsonwebtoken'
export async function checkauth(req,res,next){
    const token = req.cookies.uid
    if(!token) return res.status(401).json({message:"unauthorized"})
   const detoken = jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(detoken.id).populate('plan', 'name capacity');
    if(!user) return res.status(401).json({message:"unauthorized"})
    req.user = user
    next()
}