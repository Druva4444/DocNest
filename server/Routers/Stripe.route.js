import express from 'express'
import bodyParser from 'body-parser';
const router = express.Router()
import {createCheckoutSession, stripeWebhook} from '../Controllers/Stripe.controller.js'
import { checkauth } from '../middlewares/checkauth.js'
router.post('/create-checkout-session',checkauth,createCheckoutSession)
router.post(
    '/stripe/webhook',
    bodyParser.raw({ type: 'application/json' }),
    (req, res, next) => {
      req.rawBody = req.body; 
      next();
    },
    stripeWebhook
  );
  
export default router