const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password by default
  },

  displayName: {
    type: String,
    trim: true,
    maxlength: [50, 'Display name cannot exceed 50 characters']
  },

  // Subscription
  subscriptionTier: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },

  subscriptionExpiry: {
    type: Date,
    default: null
  },

  stripeCustomerId: {
    type: String,
    default: null
  },

  // Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      enum: ['en', 'ru', 'es'],
      default: 'en'
    }
  },

  // Statistics
  stats: {
    totalReadings: {
      type: Number,
      default: 0
    },
    decisionsMade: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastReadingDate: {
      type: Date,
      default: null
    }
  },

  // Account status
  isActive: {
    type: Boolean,
    default: true
  },

  isEmailVerified: {
    type: Boolean,
    default: false
  },

  // GDPR
  dataExportRequested: {
    type: Boolean,
    default: false
  },

  dataExportRequestedAt: {
    type: Date,
    default: null
  }

}, {
  timestamps: true // createdAt, updatedAt
});

// ============================================
// INDEXES
// ============================================

userSchema.index({ email: 1 });
userSchema.index({ subscriptionTier: 1 });
userSchema.index({ createdAt: -1 });

// ============================================
// MIDDLEWARE
// ============================================

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ============================================
// METHODS
// ============================================

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Check if premium is active
userSchema.methods.isPremium = function() {
  return this.subscriptionTier === 'premium' &&
         this.subscriptionExpiry &&
         this.subscriptionExpiry > new Date();
};

// Get public profile (exclude sensitive data)
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    email: this.email,
    displayName: this.displayName,
    subscriptionTier: this.subscriptionTier,
    isPremium: this.isPremium(),
    preferences: this.preferences,
    stats: {
      totalReadings: this.stats.totalReadings,
      currentStreak: this.stats.currentStreak,
      longestStreak: this.stats.longestStreak
    },
    createdAt: this.createdAt
  };
};

// Update reading stats
userSchema.methods.incrementReadings = async function() {
  this.stats.totalReadings += 1;

  // Update streak
  const today = new Date().setHours(0, 0, 0, 0);
  const lastReading = this.stats.lastReadingDate ?
    new Date(this.stats.lastReadingDate).setHours(0, 0, 0, 0) : null;

  if (!lastReading) {
    // First reading
    this.stats.currentStreak = 1;
  } else {
    const daysDiff = (today - lastReading) / (1000 * 60 * 60 * 24);

    if (daysDiff === 1) {
      // Continue streak
      this.stats.currentStreak += 1;
    } else if (daysDiff > 1) {
      // Streak broken
      this.stats.currentStreak = 1;
    }
    // If daysDiff === 0, same day, don't change streak
  }

  // Update longest streak
  if (this.stats.currentStreak > this.stats.longestStreak) {
    this.stats.longestStreak = this.stats.currentStreak;
  }

  this.stats.lastReadingDate = new Date();

  await this.save();
};

// ============================================
// STATICS
// ============================================

// Find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

// Create user
userSchema.statics.createUser = async function(email, password, displayName = null) {
  const user = new this({
    email,
    password,
    displayName: displayName || email.split('@')[0]
  });

  await user.save();
  return user;
};

module.exports = mongoose.model('User', userSchema);
