const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripe.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { premiumLimiter, webhookLimiter } = require('../middleware/rateLimiter');

// Protected routes (require authentication + rate limiting)
router.post('/create-checkout-session', premiumLimiter, authenticate, stripeController.createCheckoutSession);
router.get('/subscription-status', premiumLimiter, authenticate, stripeController.getSubscriptionStatus);
router.post('/cancel-subscription', premiumLimiter, authenticate, stripeController.cancelSubscription);

// Webhook route (public but verified by Stripe signature)
// IMPORTANT: This needs raw body, so it should be before express.json() middleware
router.post('/webhook', webhookLimiter, express.raw({ type: 'application/json' }), stripeController.handleWebhook);

module.exports = router;
