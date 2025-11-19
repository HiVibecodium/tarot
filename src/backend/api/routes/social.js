/**
 * Social Features Routes
 * Sharing, referrals, and community features
 */

const express = require('express');
const router = express.Router();
const { authenticate: auth, optionalAuth } = require('../../middleware/auth.middleware');
const { body, param, validationResult } = require('express-validator');
const crypto = require('crypto');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// ===== READING SHARING =====

/**
 * POST /api/social/share/create
 * Create a shareable link for a reading
 */
router.post(
  '/share/create',
  auth,
  [
    body('readingId').notEmpty().withMessage('Reading ID required'),
    body('privacy').optional().isIn(['public', 'unlisted', 'friends']).withMessage('Invalid privacy setting')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { user } = req;
      const { readingId, privacy = 'public' } = req.body;
      const db = req.app.locals.db;

      // Get reading
      const allReadings = await db.getCollection('readings');
      const reading = allReadings.find(r => (r.id === readingId || r._id === readingId) && r.userId === user.userId);

      if (!reading) {
        return res.status(404).json({
          success: false,
          error: 'Reading not found'
        });
      }

      // Generate unique share ID
      const shareId = crypto.randomBytes(16).toString('hex');

      // Create share record
      const share = {
        id: shareId,
        readingId,
        userId: user.userId,
        privacy,
        createdAt: new Date(),
        views: 0,
        likes: 0
      };

      // Save to database
      await db.addToCollection('shares', share);

      const shareUrl = `${process.env.FRONTEND_URL}/share/${shareId}`;

      res.json({
        success: true,
        share: {
          id: shareId,
          url: shareUrl,
          privacy
        }
      });
    } catch (error) {
      console.error('Error creating share:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create share'
      });
    }
  }
);

/**
 * GET /api/social/share/:shareId
 * Get a shared reading
 */
router.get('/share/:shareId', optionalAuth, async (req, res) => {
  try {
    const { shareId } = req.params;
    const db = req.app.locals.db;

    // Get share
    const share = db.getCollection('shares').find(s => s.id === shareId);

    if (!share) {
      return res.status(404).json({
        success: false,
        error: 'Share not found'
      });
    }

    // Check privacy
    if (share.privacy === 'friends' && (!req.user || req.user.userId !== share.userId)) {
      return res.status(403).json({
        success: false,
        error: 'This reading is private'
      });
    }

    // Get reading
    const reading = db.getCollection('readings').find(r => r.id === share.readingId);

    if (!reading) {
      return res.status(404).json({
        success: false,
        error: 'Reading not found'
      });
    }

    // Increment views
    share.views++;
    db.updateInCollection('shares', shareId, share);

    // Get user info (without sensitive data)
    const user = db.getUser(share.userId);

    res.json({
      success: true,
      reading: {
        ...reading,
        user: {
          name: user.name || 'Аноним',
          avatar: user.avatar || null
        }
      },
      share: {
        views: share.views,
        likes: share.likes,
        createdAt: share.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching shared reading:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch shared reading'
    });
  }
});

/**
 * POST /api/social/share/:shareId/like
 * Like a shared reading
 */
router.post('/share/:shareId/like', auth, async (req, res) => {
  try {
    const { shareId } = req.params;
    const { user } = req;
    const db = req.app.locals.db;

    const share = db.getCollection('shares').find(s => s.id === shareId);

    if (!share) {
      return res.status(404).json({
        success: false,
        error: 'Share not found'
      });
    }

    // Check if already liked
    const likes = db.getCollection('likes') || [];
    const existingLike = likes.find(l => l.shareId === shareId && l.userId === user.userId);

    if (existingLike) {
      return res.status(400).json({
        success: false,
        error: 'Already liked'
      });
    }

    // Add like
    db.addToCollection('likes', {
      id: Date.now().toString(),
      shareId,
      userId: user.userId,
      createdAt: new Date()
    });

    // Increment like count
    share.likes++;
    db.updateInCollection('shares', shareId, share);

    res.json({
      success: true,
      likes: share.likes
    });
  } catch (error) {
    console.error('Error liking share:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like share'
    });
  }
});

// ===== REFERRAL PROGRAM =====

/**
 * GET /api/social/referral/code
 * Get user's referral code
 */
router.get('/referral/code', auth, async (req, res) => {
  try {
    const { user } = req;
    const db = req.app.locals.db;

    const userData = await db.getUser(user.userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Generate referral code if doesn't exist
    if (!userData.referralCode) {
      userData.referralCode = crypto.randomBytes(6).toString('hex').toUpperCase();
      await db.updateUser(user.userId, userData);
    }

    // Get referral stats
    const allReferrals = await db.getCollection('referrals');
    const userReferrals = allReferrals.filter(r => r.referrerId === user.userId);

    const stats = {
      totalReferrals: userReferrals.length,
      activeReferrals: userReferrals.filter(r => r.isActive).length,
      earnings: userReferrals.reduce((sum, r) => sum + (r.earnings || 0), 0)
    };

    res.json({
      success: true,
      referralCode: userData.referralCode,
      referralUrl: `${process.env.FRONTEND_URL}/register?ref=${userData.referralCode}`,
      stats
    });
  } catch (error) {
    console.error('Error getting referral code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get referral code'
    });
  }
});

/**
 * POST /api/social/referral/apply
 * Apply a referral code during registration
 */
router.post(
  '/referral/apply',
  [
    body('code').notEmpty().withMessage('Referral code required'),
    body('userId').notEmpty().withMessage('User ID required')
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { code, userId } = req.body;
      const db = req.app.locals.db;

      // Find referrer by code
      const users = db.getCollection('users');
      const referrer = users.find(u => u.referralCode === code.toUpperCase());

      if (!referrer) {
        return res.status(404).json({
          success: false,
          error: 'Invalid referral code'
        });
      }

      // Create referral record
      const referral = {
        id: Date.now().toString(),
        referrerId: referrer.id,
        referredId: userId,
        code: code.toUpperCase(),
        createdAt: new Date(),
        isActive: true,
        earnings: 0
      };

      db.addToCollection('referrals', referral);

      // Grant bonus to both users
      // Referrer gets 1 week premium
      const referrerUser = db.getUser(referrer.id);
      if (referrerUser) {
        const premiumEnd = new Date();
        premiumEnd.setDate(premiumEnd.getDate() + 7);

        db.updateUser(referrer.id, {
          isPremium: true,
          premiumUntil: premiumEnd
        });
      }

      // Referred user gets 3 days premium
      const referredUser = db.getUser(userId);
      if (referredUser) {
        const premiumEnd = new Date();
        premiumEnd.setDate(premiumEnd.getDate() + 3);

        db.updateUser(userId, {
          isPremium: true,
          premiumUntil: premiumEnd
        });
      }

      res.json({
        success: true,
        message: 'Referral code applied successfully',
        bonuses: {
          referrer: '7 дней Premium',
          referred: '3 дня Premium'
        }
      });
    } catch (error) {
      console.error('Error applying referral code:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to apply referral code'
      });
    }
  }
);

/**
 * GET /api/social/referral/history
 * Get referral history
 */
router.get('/referral/history', auth, async (req, res) => {
  try {
    const { user } = req;
    const db = req.app.locals.db;

    const referrals = db.getCollection('referrals') || [];
    const userReferrals = referrals.filter(r => r.referrerId === user.userId);

    // Populate with referred user data
    const history = userReferrals.map(referral => {
      const referredUser = db.getUser(referral.referredId);

      return {
        id: referral.id,
        user: {
          name: referredUser?.name || 'Пользователь',
          email: referredUser?.email?.replace(/(.{3}).*@/, '$1***@') || 'Скрыто'
        },
        createdAt: referral.createdAt,
        isActive: referral.isActive,
        earnings: referral.earnings || 0
      };
    });

    res.json({
      success: true,
      referrals: history
    });
  } catch (error) {
    console.error('Error fetching referral history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch referral history'
    });
  }
});

module.exports = router;
