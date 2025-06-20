import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import uploadrouter from './Routers/upload.router.js'
import cookieParser from "cookie-parser"
import authrouter from './Routers/auth.route.js'
import Striperouter from './Routers/Stripe.route.js'
import planrouter from './Routers/plan.route.js'
import webhookrouter from './Routers/prebody.js'
import cors from 'cors'
import bodyParser from 'body-parser';
dotenv.config();
const app = express();
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use('/api/',webhookrouter)
app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 5000;
app.use('/api/',uploadrouter)
app.use('/api/',authrouter)

app.use('/api/',planrouter)
app.use('/api/',Striperouter)

mongoose.connect(process.env.MONGO_URL).then(()=>{console.log('mongodb connefcted')});
app.listen(PORT,()=>{console.log(`server running on port ${PORT}`)})