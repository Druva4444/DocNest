import User from '../Models/User.model.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

if (!process.env.JWT_SECRET || !process.env.GOOGLE_CLIENT_ID) {
  console.error('❌ Missing required environment variables.');
  process.exit(1);
}

// Google Auth
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
      httpOnly: true,
      secure: true, 
      sameSite: 'Strict',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Google login successful' });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(401).json({ message: 'Invalid Google token' });
  }
}

// Normal Login
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email or password not provided' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // ❗ Warning: Plain-text comparison, not recommended
    if (user.password !== password) {
      return res.status(400).json({ message: 'Password does not match' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.cookie('uid', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Signup
export async function signup(req, res) {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ❗ Warning: Password is not hashed (use bcrypt in production)
    await User.create({ name, email, password });

    return res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Logout
export async function logout(req, res) {
  try {
    res.clearCookie('uid', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Something went wrong during logout' });
  }
}
