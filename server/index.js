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
import path from 'path'
const __dirname =path.resolve()
dotenv.config();
const app = express();
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use('/api/stripe',webhookrouter)
app.use(express.json())
app.use(cookieParser())
const PORT = process.env.PORT || 5000;
app.use('/api/',uploadrouter)
app.use('/api/',authrouter)

app.use('/api/',planrouter)
app.use('/api/',Striperouter)
if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,'../client/dist')))
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'../client','dist','index.html'))
    })
}

mongoose.connect(process.env.MONGO_URL).then(()=>{console.log('mongodb connefcted')}).catch((err)=>{console.log('error connecting')});
app.listen(PORT,()=>{console.log(`server running on port ${PORT}`)})