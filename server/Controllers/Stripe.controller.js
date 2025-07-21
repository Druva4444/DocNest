import Stripe from 'stripe';
import dotenv from 'dotenv';
import Plan from '../Models/Plan.model.js';
import Subscription from '../Models/Subscription.model.js';
import User from '../Models/User.model.js';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  console.error('❌ Stripe keys missing in environment variables');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
export async function createCheckoutSession(req, res) {
  // console.log('Inside createCheckoutSession');
  const { plan } = req.body;

  try {
    const planObj = await Plan.findById(plan);
    if (!planObj) {
      return res.status(400).json({ message: "Plan not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: planObj.stripeprice,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/plans`,
      metadata: {
        planId: plan.toString(),
        userId: req.user._id.toString(),
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Stripe Webhook Handler
export const stripeWebhook = async (req, res) => {
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

     const currentPeriodEnd = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days from now

      await Subscription.updateMany(
        { user: userId, status: 'active' },
        { $set: { status: 'cancelled' } }
      );

      await Subscription.create({
        user: userId,
        plan: planId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        endDate: new Date(currentPeriodEnd * 1000),
      });

      await User.findByIdAndUpdate(userId, { plan: planId });
    } catch (err) {
      console.error('Error processing subscription:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(200).json({ received: true });
};

