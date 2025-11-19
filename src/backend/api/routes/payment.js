/**
 * Payment & Subscription Routes
 * Stripe integration for premium subscriptions
 */

const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { authenticate: auth } = require('../../middleware/auth.middleware');
const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Initialize Stripe (use test key in development)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// ===== SUBSCRIPTION MANAGEMENT =====

/**
 * GET /api/payment/subscription
 * Get user's current subscription status
 */
router.get('/subscription', auth, async (req, res) => {
  try {
    const { user } = req;

    // Get user from database
    const userData = req.app.locals.db.getUser(user.userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // If user has Stripe customer ID, fetch subscription from Stripe
    if (userData.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: userData.stripeCustomerId,
        status: 'active',
        limit: 1
      });

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];

        return res.json({
          success: true,
          subscription: {
            id: subscription.id,
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            plan: subscription.items.data[0].price.id
          }
        });
      }
    }

    // No active subscription
    res.json({
      success: true,
      subscription: null,
      hasPremium: userData.isPremium || false
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription'
    });
  }
});

/**
 * POST /api/payment/create-checkout-session
 * Create Stripe checkout session for subscription
 */
router.post(
  '/create-checkout-session',
  auth,
  [
    body('priceId').notEmpty().withMessage('Price ID required'),
    body('successUrl').optional().isURL(),
    body('cancelUrl').optional().isURL()
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { user } = req;
      const { priceId, successUrl, cancelUrl } = req.body;

      const userData = req.app.locals.db.getUser(user.userId);

      if (!userData) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Create or retrieve Stripe customer
      let customerId = userData.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: userData.email,
          metadata: {
            userId: user.userId
          }
        });

        customerId = customer.id;

        // Save customer ID to user
        req.app.locals.db.updateUser(user.userId, {
          stripeCustomerId: customerId
        });
      }

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1
          }
        ],
        success_url: successUrl || `${process.env.FRONTEND_URL}/premium?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/premium?canceled=true`,
        metadata: {
          userId: user.userId
        }
      });

      res.json({
        success: true,
        sessionId: session.id,
        url: session.url
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create checkout session',
        message: error.message
      });
    }
  }
);

/**
 * POST /api/payment/create-portal-session
 * Create Stripe customer portal session (manage subscription)
 */
router.post('/create-portal-session', auth, async (req, res) => {
  try {
    const { user } = req;
    const userData = req.app.locals.db.getUser(user.userId);

    if (!userData || !userData.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        error: 'No subscription found'
      });
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: userData.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/premium`
    });

    res.json({
      success: true,
      url: session.url
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create portal session'
    });
  }
});

/**
 * POST /api/payment/webhook
 * Stripe webhook handler
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('⚠️  Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('📬 Stripe webhook event:', event.type);

    // Handle different event types
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutComplete(event.data.object, req.app.locals.db);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await handleSubscriptionUpdate(event.data.object, req.app.locals.db);
          break;

        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object, req.app.locals.db);
          break;

        case 'invoice.payment_succeeded':
          console.log('✅ Payment succeeded:', event.data.object.id);
          break;

        case 'invoice.payment_failed':
          await handlePaymentFailed(event.data.object, req.app.locals.db);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }
);

// ===== WEBHOOK HANDLERS =====

async function handleCheckoutComplete(session, db) {
  console.log('✅ Checkout completed:', session.id);

  const userId = session.metadata.userId;
  if (!userId) {
    console.error('No userId in checkout session metadata');
    return;
  }

  // Update user to premium
  db.updateUser(userId, {
    isPremium: true,
    premiumSince: new Date(),
    stripeCustomerId: session.customer,
    stripeSubscriptionId: session.subscription
  });

  console.log(`🎉 User ${userId} upgraded to premium`);

  // Send welcome email
  try {
    const emailService = require('../../services/email.service');
    const user = db.getCollection('users').find(u => u.id === userId);
    if (user) {
      await emailService.sendPremiumWelcome(user, session);
      console.log(`📧 Welcome email sent to ${user.email}`);
    }
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error.message);
  }
}

async function handleSubscriptionUpdate(subscription, db) {
  console.log('🔄 Subscription updated:', subscription.id);

  const customerId = subscription.customer;

  // Find user by Stripe customer ID
  const users = db.getCollection('users');
  const user = users.find(u => u.stripeCustomerId === customerId);

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Update subscription status
  db.updateUser(user.id, {
    isPremium: subscription.status === 'active',
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    currentPeriodEnd: new Date(subscription.current_period_end * 1000)
  });

  console.log(`✅ User ${user.id} subscription updated: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription, db) {
  console.log('❌ Subscription deleted:', subscription.id);

  const customerId = subscription.customer;

  // Find user by Stripe customer ID
  const users = db.getCollection('users');
  const user = users.find(u => u.stripeCustomerId === customerId);

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Downgrade user
  db.updateUser(user.id, {
    isPremium: false,
    subscriptionStatus: 'canceled',
    canceledAt: new Date()
  });

  console.log(`⬇️  User ${user.id} downgraded from premium`);

  // Send cancellation email
  try {
    const emailService = require('../../services/email.service');
    await emailService.sendPremiumCanceled(user, subscription);
    console.log(`📧 Cancellation email sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Failed to send cancellation email:', error.message);
  }
}

async function handlePaymentFailed(invoice, db) {
  console.log('❌ Payment failed:', invoice.id);

  const customerId = invoice.customer;

  // Find user by Stripe customer ID
  const users = db.getCollection('users');
  const user = users.find(u => u.stripeCustomerId === customerId);

  if (!user) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Send payment failed notification
  try {
    const emailService = require('../../services/email.service');
    await emailService.sendPaymentFailed(user, invoice);
    console.log(`📧 Payment failed notification sent to ${user.email}`);
  } catch (error) {
    console.error('❌ Failed to send payment failed email:', error.message);
  }
}

// ===== PRICING INFO =====

/**
 * GET /api/payment/pricing
 * Get available pricing plans
 */
router.get('/pricing', async (req, res) => {
  try {
    // Fetch active prices from Stripe
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product']
    });

    const plans = prices.data.map(price => ({
      id: price.id,
      amount: price.unit_amount / 100,
      currency: price.currency,
      interval: price.recurring?.interval,
      productName: price.product.name,
      productDescription: price.product.description
    }));

    res.json({
      success: true,
      plans
    });
  } catch (error) {
    console.error('Error fetching pricing:', error);

    // Return default pricing if Stripe fails
    res.json({
      success: true,
      plans: [
        {
          id: 'price_premium_monthly',
          amount: 499,
          currency: 'rub',
          interval: 'month',
          productName: 'Premium',
          productDescription: 'Unlimited readings, all features'
        }
      ]
    });
  }
});

module.exports = router;
