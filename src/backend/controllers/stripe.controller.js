const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User.json-model');

/**
 * @desc    Create Stripe Checkout Session for Premium subscription
 * @route   POST /api/stripe/create-checkout-session
 * @access  Private
 */
exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Пользователь не найден'
        }
      });
    }

    // Check if already premium
    if (user.subscriptionTier === 'premium') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_PREMIUM',
          message: 'У вас уже есть премиум подписка'
        }
      });
    }

    // Create Stripe customer if doesn't exist
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id
        }
      });
      customerId = customer.id;

      // Save customer ID
      await User.update(userId, { stripeCustomerId: customerId });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/premium`,
      metadata: {
        userId: user._id
      }
    });

    res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });

  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CHECKOUT_FAILED',
        message: 'Не удалось создать сессию оплаты',
        details: error.message
      }
    });
  }
};

/**
 * @desc    Handle Stripe Webhook events
 * @route   POST /api/stripe/webhook
 * @access  Public (but verified by Stripe signature)
 */
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

/**
 * @desc    Get subscription status
 * @route   GET /api/stripe/subscription-status
 * @access  Private
 */
exports.getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Пользователь не найден'
        }
      });
    }

    let subscription = null;
    if (user.stripeSubscriptionId) {
      try {
        subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      } catch (error) {
        console.error('Error retrieving subscription:', error);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        subscriptionTier: user.subscriptionTier,
        isPremium: user.isPremium || false,
        stripeSubscriptionId: user.stripeSubscriptionId,
        subscriptionStatus: subscription?.status || null,
        currentPeriodEnd: subscription?.current_period_end ? new Date(subscription.current_period_end * 1000) : null
      }
    });

  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'STATUS_FETCH_FAILED',
        message: 'Не удалось получить статус подписки'
      }
    });
  }
};

/**
 * @desc    Cancel subscription
 * @route   POST /api/stripe/cancel-subscription
 * @access  Private
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user || !user.stripeSubscriptionId) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NO_SUBSCRIPTION',
          message: 'Активная подписка не найдена'
        }
      });
    }

    // Cancel at period end (user keeps access until end of billing cycle)
    const subscription = await stripe.subscriptions.update(
      user.stripeSubscriptionId,
      { cancel_at_period_end: true }
    );

    res.status(200).json({
      success: true,
      data: {
        message: 'Подписка будет отменена в конце расчётного периода',
        cancelAt: new Date(subscription.cancel_at * 1000)
      }
    });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'CANCEL_FAILED',
        message: 'Не удалось отменить подписку'
      }
    });
  }
};

// ============================================
// WEBHOOK EVENT HANDLERS
// ============================================

async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id);

  const userId = session.metadata.userId;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (userId && subscriptionId) {
    await User.update(userId, {
      subscriptionTier: 'premium',
      isPremium: true,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId
    });
    console.log(`✅ User ${userId} upgraded to premium`);
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id);

  const customerId = subscription.customer;
  const users = await User.findByStripeCustomerId(customerId);

  if (users && users.length > 0) {
    const user = users[0];
    const isPremium = subscription.status === 'active';

    await User.update(user._id, {
      subscriptionTier: isPremium ? 'premium' : 'free',
      isPremium: isPremium
    });
    console.log(`✅ User ${user._id} subscription updated: ${subscription.status}`);
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log('Subscription deleted:', subscription.id);

  const customerId = subscription.customer;
  const users = await User.findByStripeCustomerId(customerId);

  if (users && users.length > 0) {
    const user = users[0];

    await User.update(user._id, {
      subscriptionTier: 'free',
      isPremium: false,
      stripeSubscriptionId: null
    });
    console.log(`✅ User ${user._id} downgraded to free`);
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
  console.log('Invoice payment succeeded:', invoice.id);
  // Could send receipt email here
}

async function handleInvoicePaymentFailed(invoice) {
  console.log('Invoice payment failed:', invoice.id);
  // Could send payment failure notification here
}
