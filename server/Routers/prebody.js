import express from 'express'
import bodyParser from 'body-parser';
const router = express.Router()
import {stripeWebhook} from '../Controllers/Stripe.controller.js'
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