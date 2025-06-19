import User from '../Models/User.model.js'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv'
dotenv.config()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_ID)
export async function googleAuth(req, res) {
    const { token } = req.body;
  
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
      const { email, name, picture, sub } = payload;
      let user = await User.findOne({ googleId: sub });
      if (!user) {
        user = await User.findOne({ email });
  
        if (user) {
          user.googleId = sub;
          user.avatar = user.avatar || picture;
          await user.save();
        } else {
          user = await User.create({
            name,
            email,
            googleId: sub,
            avatar: picture,
          });
        }
      }
      const tokenx = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '3d',
      });
  
      res.cookie('uid', tokenx, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        
        secure: true,
        sameSite: 'Strict',
      });
  
      return res.status(200).json({ message: 'Google login successful' });
    } catch (error) {
      console.error('Google Auth Error:', error);
      res.status(401).json({ message: 'Invalid Google token' });
    }
  }
export async function login(req,res){
    const {email,password}= req.body
    try {
        if(!email || !password)
        {
            return res.status(400).json({message:"email or password not found"})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        if(user.password !== password)
        {
            return res.status(400).json({message:"password not matched"})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.cookie('uid',token,{maxAge:3*24*60*60*1000})
        return res.status(200).json({message:"login successfull"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server error"})
    }
}
export async function signup(req,res){
    const {name,email,password} = req.body
    try{
        if(!name || !email || !password) return res.status(400).json({message:"email or password not found"})
        const existeduser = await User.findOne({email})
    if(existeduser)
    {
        return res.status(400).json({message:"user already exist"})
    }
        const user = await User.create({name,email,password})
        return res.status(201).json({message:"signup successfull"})
    }catch(error){
        console.log(error)
        return res.status(500).json({message:"internal server error"})
    }
}
// controllers/authController.js
export async function logout(req, res) {
    try {
      res.clearCookie('uid');
      return res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Something went wrong during logout' });
    }
  }

  