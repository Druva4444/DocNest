import express from 'express'
const router = express.Router()
import {login,signup,logout,googleAuth} from '../Controllers/auth.controller.js'
router.post('/login',login)
router.post('/signup',signup)
router.get('/logout',logout)
router.post('/google-auth', googleAuth);
export default router