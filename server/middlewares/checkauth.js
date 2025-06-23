import User from '../Models/User.model.js';
import jwt from 'jsonwebtoken';

export async function checkauth(req, res, next) {
  const token = req.cookies.uid;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('plan', 'name capacity');

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
    
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
}
