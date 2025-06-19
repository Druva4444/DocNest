import Stripe from 'stripe';
import dotenv from 'dotenv';    
import Plan from '../Models/Plan.model.js'
import Subscription from '../Models/Subscription.model.js';
import User from '../Models/User.model.js'
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);



export async function createCheckoutSession(req, res) {
  console.log('inside')
  const { plan } = req.body;
 


  try {
    const planobj = await Plan.findById(plan)
  
    if(!planobj){
      return res.status(400).json({message:"plan not found"})
    }
    console.log(planobj)
    console.log('Stripe price ID:', planobj.stripeprice);  // Debug log

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: planobj.stripeprice,
          quantity: 1,
        },
      ],
      mode: 'subscription', 
      success_url: process.env.FRONTEND_URL+'/success',
      cancel_url: process.env.FRONTEND_URL+'/plans',
      metadata:{
        planId:plan.toString(),
        userId:req.user._id.toString()
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
export const stripeWebhook = async (req, res) => {
  console.log('inside webhook');

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, 
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);

      const userId = session.metadata.userId;  
      const planId = session.metadata.planId; 
      await Subscription.updateMany(
        { user: userId, status: 'active' },
        { $set: { status: 'cancelled' } }
      );

      const x =  new Date(subscription.current_period_end * 1000);
      await Subscription.create({
        user: userId,
        plan: planId,
        
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
       
        endDate: (() => {
          const d = new Date();
          d.setDate(d.getDate() + 30);
          return d;
        })(),
      });
     
      await User.findByIdAndUpdate(userId, {
        plan: planId,
      });

      console.log(` Subscription created for user ${userId}`);
    } catch (err) {
      console.error('Error processing subscription:', err);
    }
  }

  res.status(200).json({ received: true });
};
