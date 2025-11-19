# MVB (Minimum Viable Breakthrough) Patterns

## Pattern Catalog for AI Tarot Decision Assistant

### Pattern 1: AI Interpretation with Fallback

**Problem**: OpenAI API dependency creates single point of failure
**Constraint**: C1 - External service reliability
**MVB Solution**: Graceful degradation with pre-generated interpretations

```javascript
// Pattern Implementation
class InterpretationEngine {
  async generateReading(cards, context, userId) {
    const cacheKey = this.buildCacheKey(cards, context.type);

    // L1: Check Redis cache for similar readings
    const cached = await redis.get(cacheKey);
    if (cached && this.isFresh(cached)) {
      return this.personalize(cached, userId);
    }

    // L2: Try OpenAI API with circuit breaker
    if (this.circuitBreaker.isOpen()) {
      return this.getFallbackInterpretation(cards, context);
    }

    try {
      const aiResult = await this.callOpenAI(cards, context, userId);
      await redis.setex(cacheKey, 3600, aiResult); // Cache 1 hour
      return aiResult;
    } catch (error) {
      this.circuitBreaker.recordFailure();
      logger.error("OpenAI API failed", error);

      // L3: Fallback to template-based interpretation
      return this.getFallbackInterpretation(cards, context);
    }
  }

  getFallbackInterpretation(cards, context) {
    // Combine static card meanings with context-aware templates
    const interpretations = cards.map(card => {
      const meaning = card.reversed
        ? CARD_DATABASE[card.cardId].reversed
        : CARD_DATABASE[card.cardId].upright;

      return {
        cardName: card.name,
        position: card.positionName,
        meaning: meaning.detailedMeaning,
        advice: meaning.advice
      };
    });

    return {
      summary: this.buildSummary(interpretations, context),
      detailedAnalysis: this.buildAnalysis(interpretations),
      actionableAdvice: this.buildAdvice(interpretations, context),
      source: "fallback",
      confidence: 0.7
    };
  }
}
```

**Success Metrics**:
- API success rate > 99.5%
- Fallback usage < 1% of readings
- User satisfaction with fallback > 3.5/5

---

### Pattern 2: Tiered Feature Access (Freemium)

**Problem**: Balance free value with premium conversion
**Constraint**: RC2 - Budget limitations require revenue
**MVB Solution**: Strategic feature gating with clear upgrade path

```javascript
// Feature Access Control Pattern
const FEATURE_TIERS = {
  free: {
    dailyReadings: 1,
    decisionReadings: 0, // must upgrade
    purchaseReadings: 3, // limited
    historyDays: 7,
    spreadTypes: ["single-card"],
    analytics: false,
    aiPersonalization: false,
    export: false
  },
  premium: {
    dailyReadings: Infinity,
    decisionReadings: Infinity,
    purchaseReadings: Infinity,
    historyDays: 365,
    spreadTypes: ["single-card", "three-card", "celtic-cross"],
    analytics: true,
    aiPersonalization: true,
    export: "pdf"
  }
};

class FeatureGate {
  async canAccessFeature(user, featureName, usageCount) {
    const tier = user.subscription.tier;
    const limit = FEATURE_TIERS[tier][featureName];

    if (limit === Infinity) return { allowed: true };
    if (usageCount < limit) return { allowed: true };

    // Soft paywall with upgrade prompt
    return {
      allowed: false,
      reason: "limit_reached",
      upgradeMessage: this.getUpgradeMessage(featureName),
      trialOffer: this.getTrialOffer(user)
    };
  }

  getUpgradeMessage(featureName) {
    const messages = {
      decisionReadings: "Unlock unlimited decision analysis with Premium",
      analytics: "See your patterns and improve decisions with Premium",
      aiPersonalization: "Get personalized readings that learn from you"
    };
    return messages[featureName];
  }
}
```

**Conversion Optimization**:
- Show upgrade prompt after 3 free daily readings (habit formed)
- Highlight value during blocked actions ("You saved $X with Premium")
- Offer 7-day trial for first-time upgrade consideration

---

### Pattern 3: Background Job Processing

**Problem**: Daily readings must be generated at user-configured times
**Constraint**: RC3 - Timeline pressure requires efficient architecture
**MVB Solution**: Bull queue with Redis for scheduled tasks

```javascript
// Scheduled Job Pattern
const Queue = require("bull");
const dailyReadingsQueue = new Queue("daily-readings", {
  redis: process.env.REDIS_URL
});

// Schedule daily readings for all users
async function scheduleDailyReadings() {
  const users = await User.find({
    "preferences.notificationsEnabled": true
  }).select("_id preferences.dailyReadingTime");

  for (const user of users) {
    const scheduledTime = this.calculateNextReading(user);

    await dailyReadingsQueue.add(
      { userId: user._id },
      {
        delay: scheduledTime - Date.now(),
        jobId: `daily-${user._id}-${scheduledTime}`
      }
    );
  }
}

// Process daily reading generation
dailyReadingsQueue.process(async (job) => {
  const { userId } = job.data;

  // Generate reading
  const reading = await ReadingService.generateDailyReading(userId);

  // Send notification
  await NotificationService.sendDailyNotification(userId, reading);

  // Schedule next day's reading
  await this.scheduleNextReading(userId);
});

// Monitoring and retry logic
dailyReadingsQueue.on("failed", (job, err) => {
  logger.error(`Daily reading failed for user ${job.data.userId}`, err);

  // Retry up to 3 times with exponential backoff
  if (job.attemptsMade < 3) {
    job.retry();
  } else {
    alerting.notify("daily-reading-failure", job.data);
  }
});
```

**Reliability Metrics**:
- Job success rate > 99%
- Notification delivery within 5 minutes of scheduled time
- Failed job alerting within 1 minute

---

### Pattern 4: Cross-Platform State Sync

**Problem**: Users switch between web, mobile, extension
**Constraint**: C7 - Cross-platform code sharing limitations
**MVB Solution**: Server-side state with optimistic updates

```javascript
// State Synchronization Pattern
class SyncManager {
  constructor() {
    this.pendingUpdates = [];
    this.syncInterval = 30000; // 30 seconds
  }

  // Optimistic update pattern
  async updateReading(readingId, updates) {
    // 1. Update local state immediately (optimistic)
    store.dispatch(updateReadingLocal(readingId, updates));

    // 2. Queue server sync
    this.pendingUpdates.push({
      id: readingId,
      updates,
      timestamp: Date.now(),
      retries: 0
    });

    // 3. Attempt sync
    try {
      await this.syncToServer(readingId, updates);
      this.removePendingUpdate(readingId);
    } catch (error) {
      // Will retry on next sync interval
      logger.warn("Sync failed, will retry", error);
    }
  }

  // Background sync process
  async backgroundSync() {
    if (this.pendingUpdates.length === 0) return;

    for (const update of this.pendingUpdates) {
      try {
        await this.syncToServer(update.id, update.updates);
        this.removePendingUpdate(update.id);
      } catch (error) {
        update.retries++;

        // Give up after 5 retries
        if (update.retries >= 5) {
          this.handleSyncFailure(update);
          this.removePendingUpdate(update.id);
        }
      }
    }
  }

  // Conflict resolution
  async resolveConflict(localData, serverData) {
    // Last-write-wins strategy with timestamp comparison
    if (localData.updatedAt > serverData.updatedAt) {
      await this.syncToServer(localData.id, localData);
    } else {
      store.dispatch(updateReadingLocal(serverData.id, serverData));
    }
  }
}

// WebSocket for real-time sync (optional enhancement)
io.on("connection", (socket) => {
  socket.on("reading:updated", async (data) => {
    // Broadcast to user's other connected devices
    socket.to(`user:${data.userId}`).emit("reading:sync", data);
  });
});
```

**Sync Quality Metrics**:
- Sync latency < 2 seconds under normal conditions
- Conflict rate < 0.1% of syncs
- Data loss rate = 0%

---

### Pattern 5: Progressive Enhancement for Extension

**Problem**: Extension must work with minimal permissions
**Constraint**: C4 - Browser extension marketplace permissions
**MVB Solution**: Request minimum permissions, enhance when granted

```javascript
// Minimal Permission Pattern
const MINIMAL_PERMISSIONS = {
  permissions: ["activeTab", "storage"],
  host_permissions: [] // Request only when needed
};

class ExtensionPermissionManager {
  async checkProductPage() {
    const tab = await this.getCurrentTab();

    // Detect if on supported marketplace without permission
    if (this.isSupportedMarketplace(tab.url)) {
      // Check if we have host permission
      const hasPermission = await chrome.permissions.contains({
        origins: [new URL(tab.url).origin + "/*"]
      });

      if (!hasPermission) {
        // Show permission request UI
        return { needsPermission: true, site: tab.url };
      }

      // Inject content script
      await this.injectGuidanceUI(tab.id);
    }
  }

  async requestHostPermission(origin) {
    // Request permission only when user clicks "Enable on this site"
    return chrome.permissions.request({
      origins: [origin + "/*"]
    });
  }

  // Graceful degradation if permission denied
  async provideLimitedGuidance(productUrl) {
    // Can still provide reading, just can't inject UI
    const reading = await api.getPurchaseGuidance(productUrl);

    // Show in extension popup instead of in-page
    chrome.action.setPopup({ popup: "reading.html" });
    chrome.storage.local.set({ pendingReading: reading });
  }
}
```

**Permission UX Best Practices**:
- Explain why permission needed before requesting
- Work without permission (show results in popup)
- Only request when user actively wants feature
- Provide clear value proposition for granting permission

---

### Pattern 6: Decision Outcome Tracking

**Problem**: Track decision accuracy for pattern learning
**Constraint**: User engagement required for outcome recording
**MVB Solution**: Smart prompts with gamification

```javascript
// Outcome Tracking Pattern
class OutcomeTracker {
  async scheduleOutcomePrompt(decisionReading) {
    // Calculate when to prompt based on decision type
    const promptDelay = this.calculatePromptTiming(decisionReading);

    await notificationQueue.add(
      {
        type: "outcome-prompt",
        readingId: decisionReading._id,
        userId: decisionReading.userId
      },
      { delay: promptDelay }
    );
  }

  calculatePromptTiming(reading) {
    // Use AI to estimate decision resolution timeframe
    const keywords = reading.decisionContext.question.toLowerCase();

    const timingRules = {
      purchase: 7 * 24 * 60 * 60 * 1000, // 7 days
      career: 30 * 24 * 60 * 60 * 1000, // 30 days
      relationship: 14 * 24 * 60 * 60 * 1000, // 14 days
      default: 7 * 24 * 60 * 60 * 1000
    };

    for (const [category, delay] of Object.entries(timingRules)) {
      if (keywords.includes(category)) {
        return delay;
      }
    }

    return timingRules.default;
  }

  // Gamification for outcome recording
  async recordOutcome(readingId, outcome, notes) {
    const reading = await Reading.findById(readingId);

    reading.decisionContext.outcome = outcome;
    reading.decisionContext.outcomeNotes = notes;
    reading.decisionContext.outcomeRecordedAt = new Date();

    await reading.save();

    // Reward user for tracking outcomes
    await this.awardPoints(reading.userId, "outcome-recorded");

    // Update user's decision accuracy stats
    await this.updateAccuracyStats(reading);

    // Send encouraging notification
    if (outcome === "positive") {
      await NotificationService.send(reading.userId, {
        title: "Great decision! 🎉",
        body: "Your intuition is growing stronger"
      });
    }

    return reading;
  }

  async updateAccuracyStats(reading) {
    const user = await User.findById(reading.userId);

    // Calculate prediction accuracy
    const predicted = this.extractPrediction(reading.interpretation);
    const actual = reading.decisionContext.outcome;
    const accurate = predicted === actual;

    // Update rolling average
    const totalDecisions = user.stats.decisionsMade;
    const currentAccuracy = user.stats.averageAccuracyRating || 0;

    user.stats.averageAccuracyRating =
      (currentAccuracy * totalDecisions + (accurate ? 1 : 0)) /
      (totalDecisions + 1);

    await user.save();
  }
}
```

**Outcome Completion Metrics**:
- Outcome recording rate > 40%
- Average time to record outcome: 7-14 days
- User engagement with prompted outcomes > 60%

---

### Pattern 7: Affiliate Link Attribution

**Problem**: Track affiliate conversions across sessions
**Constraint**: C10 - Cookie-based tracking limitations
**MVB Solution**: First-party tracking with server-side attribution

```javascript
// Affiliate Attribution Pattern
class AffiliateTracker {
  async generateTrackedLink(productUrl, userId, readingId) {
    // Create unique tracking ID
    const trackingId = this.generateTrackingId();

    // Store attribution data server-side
    await AffiliateClick.create({
      trackingId,
      userId,
      readingId,
      productUrl,
      affiliateNetwork: this.detectNetwork(productUrl),
      clickedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    // Generate tracked URL
    const affiliateUrl = await this.buildAffiliateUrl(
      productUrl,
      trackingId
    );

    return affiliateUrl;
  }

  buildAffiliateUrl(productUrl, trackingId) {
    const url = new URL(productUrl);

    // Add our tracking parameter
    url.searchParams.set("ref", trackingId);

    // Add affiliate network tag
    if (this.isAmazon(productUrl)) {
      url.searchParams.set("tag", process.env.AMAZON_ASSOCIATE_TAG);
    }

    return url.toString();
  }

  // Webhook handler for affiliate network conversions
  async handleConversionWebhook(networkData) {
    // Extract our tracking ID from network callback
    const trackingId = this.extractTrackingId(networkData);

    if (!trackingId) {
      logger.warn("Conversion without tracking ID", networkData);
      return;
    }

    // Find attribution record
    const click = await AffiliateClick.findOne({ trackingId });

    if (!click) {
      logger.warn("Conversion for unknown tracking ID", trackingId);
      return;
    }

    // Record conversion
    await AffiliateConversion.create({
      clickId: click._id,
      userId: click.userId,
      readingId: click.readingId,
      orderValue: networkData.orderValue,
      commission: networkData.commission,
      convertedAt: new Date(),
      network: click.affiliateNetwork
    });

    // Update user stats
    await this.creditUserSavings(click.userId, networkData.orderValue);

    logger.info(
      `Affiliate conversion: $${networkData.commission} from user ${click.userId}`
    );
  }

  // Fallback: Client-side conversion detection
  async detectConversionClientSide(userId) {
    // Check if user completed purchase (for networks without webhooks)
    const recentClicks = await AffiliateClick.find({
      userId,
      convertedAt: null,
      clickedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    for (const click of recentClicks) {
      // Scrape order history or use heuristics
      const converted = await this.checkIfConverted(click);

      if (converted) {
        await this.recordEstimatedConversion(click);
      }
    }
  }
}
```

**Attribution Metrics**:
- Click-to-conversion rate: 2-5% (industry standard)
- Attribution accuracy > 80%
- Average commission per conversion: $2-10

---

### Pattern 8: AI Personalization Engine

**Problem**: Generic interpretations don't resonate with all users
**Constraint**: C8 - AI interpretation quality consistency
**MVB Solution**: User preference learning with feedback loop

```javascript
// Personalization Pattern
class PersonalizationEngine {
  async personalizeInterpretation(baseInterpretation, userId) {
    const userProfile = await this.getUserProfile(userId);

    // Adjust tone based on user preferences
    const tone = this.detectPreferredTone(userProfile);

    // Adjust length based on engagement patterns
    const preferredLength = this.detectPreferredLength(userProfile);

    // Adjust focus areas based on past ratings
    const focusAreas = this.detectFocusAreas(userProfile);

    // Use AI to adapt interpretation
    const personalizedPrompt = `
      Adapt the following tarot reading for a user who prefers:
      - Tone: ${tone}
      - Length: ${preferredLength}
      - Focus: ${focusAreas.join(", ")}

      Original reading: ${baseInterpretation}

      Provide adapted version maintaining core meaning.
    `;

    const adapted = await this.callOpenAI(personalizedPrompt);

    return adapted;
  }

  detectPreferredTone(userProfile) {
    // Analyze past feedback
    const ratings = userProfile.readingFeedback;

    const toneScores = {
      mystical: 0,
      practical: 0,
      encouraging: 0,
      direct: 0
    };

    for (const feedback of ratings) {
      if (feedback.rating >= 4) {
        // High-rated readings indicate preference
        const detectedTone = this.analyzeTone(feedback.readingText);
        toneScores[detectedTone]++;
      }
    }

    return Object.keys(toneScores).reduce((a, b) =>
      toneScores[a] > toneScores[b] ? a : b
    );
  }

  async learnFromFeedback(readingId, feedback) {
    const reading = await Reading.findById(readingId);
    const user = await User.findById(reading.userId);

    // Extract what user liked/disliked
    const analysis = await this.analyzeFeedback(
      reading.interpretation,
      feedback
    );

    // Update user preference profile
    await UserPreference.updateOne(
      { userId: user._id },
      {
        $push: {
          feedbackHistory: {
            readingId,
            rating: feedback.rating,
            toneDetected: analysis.tone,
            lengthPreference: analysis.lengthPreference,
            focusAreas: analysis.focusAreas,
            timestamp: new Date()
          }
        }
      },
      { upsert: true }
    );

    // Retrain personalization model periodically
    if (user.stats.totalReadings % 10 === 0) {
      await this.retrainUserModel(user._id);
    }
  }
}
```

**Personalization Metrics**:
- Personalized readings rated 0.5+ stars higher than generic
- Engagement time 20%+ higher with personalization
- Retention improvement 15%+ for personalized users

---

## Pattern Summary

| Pattern | Solves Constraint | Impact | Complexity |
|---------|------------------|--------|-----------|
| AI Fallback | C1: API Dependency | HIGH | Medium |
| Tiered Access | RC2: Budget | HIGH | Low |
| Background Jobs | RC3: Timeline | MEDIUM | Medium |
| State Sync | C7: Cross-Platform | MEDIUM | High |
| Progressive Enhancement | C4: Permissions | MEDIUM | Low |
| Outcome Tracking | User Engagement | HIGH | Medium |
| Affiliate Attribution | C10: Tracking | MEDIUM | Medium |
| AI Personalization | C8: Quality | HIGH | High |

---

**Document Version**: 1.0
**Last Updated**: 2025-11-07
**Pattern Review**: After each sprint retrospective
