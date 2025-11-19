# System Architecture - AI Tarot Decision Assistant

## Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├─────────────────┬─────────────────┬─────────────────┬───────────────┤
│   Web App       │   Mobile App    │   Browser Ext   │   Admin Panel │
│   (React)       │ (React Native)  │   (React)       │   (React)     │
│                 │                 │                 │               │
│  - Daily Cards  │  - Daily Cards  │  - Purchase     │  - Analytics  │
│  - Decisions    │  - Decisions    │    Guidance     │  - User Mgmt  │
│  - History      │  - Push Notif   │  - Quick Read   │  - Content    │
│  - Profile      │  - Offline Mode │                 │               │
└────────┬────────┴────────┬────────┴────────┬────────┴───────┬───────┘
         │                 │                 │                │
         └─────────────────┴─────────────────┴────────────────┘
                                   ↓
                    ┌──────────────────────────┐
                    │      API GATEWAY         │
                    │   (Express + CORS)       │
                    │  - Rate Limiting         │
                    │  - Authentication        │
                    │  - Request Validation    │
                    └─────────────┬────────────┘
                                  ↓
         ┌────────────────────────┴────────────────────────┐
         │                                                  │
┌────────▼────────┐                              ┌─────────▼─────────┐
│  AUTH SERVICE   │                              │   CORE API        │
│  (Passport.js)  │                              │   (Express.js)    │
│                 │                              │                   │
│ - JWT Tokens    │                              │ - Reading Engine  │
│ - OAuth (G/FB)  │                              │ - Decision Logic  │
│ - Session Mgmt  │                              │ - User Data API   │
└────────┬────────┘                              └─────────┬─────────┘
         │                                                  │
         └──────────────────┬───────────────────────────────┘
                            ↓
         ┌──────────────────────────────────────────────────┐
         │            BUSINESS LOGIC LAYER                  │
         ├──────────────┬───────────────┬───────────────────┤
         │ Reading      │ Decision      │ Analytics         │
         │ Service      │ Service       │ Service           │
         │              │               │                   │
         │ - Card Draw  │ - Option      │ - Pattern         │
         │ - Spread     │   Analysis    │   Detection       │
         │ - Daily      │ - Outcome     │ - User Stats      │
         │   Schedule   │   Tracking    │ - Reports         │
         └──────┬───────┴───────┬───────┴──────┬────────────┘
                │               │              │
                └───────────────┴──────────────┘
                                ↓
         ┌──────────────────────────────────────────────────┐
         │          AI & EXTERNAL SERVICES                  │
         ├──────────────┬───────────────┬───────────────────┤
         │ OpenAI       │ Notification  │ Affiliate         │
         │ Integration  │ Service       │ Service           │
         │              │               │                   │
         │ - GPT-4 API  │ - Firebase    │ - Amazon Assoc.   │
         │ - Prompt Eng │   FCM         │ - Link Tracking   │
         │ - Fallback   │ - Email       │ - Commission      │
         │ - Cache      │   (SendGrid)  │   Tracking        │
         └──────┬───────┴───────┬───────┴──────┬────────────┘
                │               │              │
                └───────────────┴──────────────┘
                                ↓
         ┌──────────────────────────────────────────────────┐
         │              DATA LAYER                          │
         ├──────────────┬───────────────┬───────────────────┤
         │ MongoDB      │ Redis Cache   │ AWS S3            │
         │ (Primary DB) │               │                   │
         │              │               │                   │
         │ - Users      │ - Sessions    │ - Card Images     │
         │ - Readings   │ - AI Cache    │ - User Exports    │
         │ - Cards      │ - Rate Limits │ - Backups         │
         │ - Subs       │               │                   │
         └──────────────┴───────────────┴───────────────────┘
```

---

## Component Architecture

### Frontend Components

#### Web Application (React + TypeScript)
```
src/frontend/
├── components/
│   ├── cards/
│   │   ├── CardDisplay.tsx          # Single card visual
│   │   ├── SpreadLayout.tsx         # Multi-card layouts
│   │   └── CardAnimation.tsx        # Card flip/reveal
│   ├── readings/
│   │   ├── DailyReading.tsx         # Daily card feature
│   │   ├── DecisionAnalysis.tsx     # Decision input form
│   │   └── ReadingHistory.tsx       # Past readings list
│   ├── common/
│   │   ├── Navigation.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorBoundary.tsx
│   └── profile/
│       ├── UserProfile.tsx
│       ├── Settings.tsx
│       └── SubscriptionManager.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── DashboardPage.tsx
│   ├── DecisionPage.tsx
│   ├── HistoryPage.tsx
│   └── ProfilePage.tsx
├── hooks/
│   ├── useAuth.ts                   # Authentication state
│   ├── useReading.ts                # Reading operations
│   ├── useNotifications.ts          # Push notifications
│   └── useAnalytics.ts              # User analytics
├── services/
│   ├── api.ts                       # API client wrapper
│   ├── auth.ts                      # Auth service
│   └── storage.ts                   # Local storage
└── store/
    ├── slices/
    │   ├── authSlice.ts
    │   ├── readingSlice.ts
    │   └── uiSlice.ts
    └── store.ts                     # Redux store config
```

#### Mobile Application (React Native)
- Shared components with web where possible
- Platform-specific UI adaptations (iOS/Android)
- Offline reading caching
- Native notifications integration

#### Browser Extension (Chrome)
```
extension/
├── manifest.json                    # Extension config
├── background/
│   └── service-worker.js            # Background processing
├── content/
│   └── product-detector.js          # Page content analysis
├── popup/
│   ├── popup.html
│   └── popup.tsx                    # Quick reading UI
└── shared/
    └── api-client.js                # Shared with main app
```

---

### Backend Architecture

#### API Server Structure
```
src/backend/
├── api/
│   ├── routes/
│   │   ├── auth.routes.js           # POST /auth/login, /register
│   │   ├── readings.routes.js       # GET/POST /readings
│   │   ├── decisions.routes.js      # GET/POST /decisions
│   │   ├── users.routes.js          # GET/PATCH /users/:id
│   │   └── webhooks.routes.js       # POST /webhooks/stripe
│   ├── middleware/
│   │   ├── authenticate.js          # JWT validation
│   │   ├── rateLimit.js             # Request throttling
│   │   ├── validation.js            # Input validation
│   │   └── errorHandler.js          # Global error handling
│   └── controllers/
│       ├── ReadingController.js
│       ├── DecisionController.js
│       ├── UserController.js
│       └── AnalyticsController.js
├── services/
│   ├── ReadingService.js            # Core reading logic
│   ├── AIService.js                 # OpenAI integration
│   ├── NotificationService.js       # FCM + Email
│   ├── AnalyticsService.js          # Pattern analysis
│   ├── SubscriptionService.js       # Stripe integration
│   └── AffiliateService.js          # Link tracking
├── models/
│   ├── User.model.js
│   ├── Reading.model.js
│   ├── Decision.model.js
│   ├── Card.model.js
│   └── Subscription.model.js
├── jobs/
│   ├── dailyReadings.job.js         # Scheduled task
│   ├── analytics.job.js             # Pattern processing
│   └── cleanup.job.js               # Data retention
└── config/
    ├── database.js
    ├── openai.js
    └── constants.js
```

---

## Data Architecture

### MongoDB Schema Design

#### Users Collection
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "user@example.com",
  passwordHash: "$2b$10$...",
  displayName: "Sarah M.",
  authProvider: "email", // or "google", "facebook"

  profile: {
    avatar: "https://...",
    birthDate: ISODate("1990-05-15"),
    timezone: "America/Los_Angeles",
    preferredLanguage: "en"
  },

  subscription: {
    tier: "premium", // "free", "premium", "pro"
    status: "active", // "active", "cancelled", "expired"
    stripeCustomerId: "cus_...",
    currentPeriodEnd: ISODate("2025-12-07"),
    cancelAtPeriodEnd: false
  },

  preferences: {
    dailyReadingTime: "08:00", // HH:mm format
    notificationsEnabled: true,
    emailNotifications: false,
    theme: "light",
    cardDeck: "rider-waite" // for future multi-deck support
  },

  stats: {
    totalReadings: 145,
    dailyStreak: 12,
    decisionsMade: 28,
    averageAccuracyRating: 4.2,
    lastReadingAt: ISODate("2025-11-07T08:00:00Z")
  },

  metadata: {
    createdAt: ISODate("2025-01-15T12:00:00Z"),
    lastLoginAt: ISODate("2025-11-07T09:30:00Z"),
    lastActive: ISODate("2025-11-07T10:15:00Z"),
    signupSource: "web", // "web", "mobile", "extension"
    referralCode: "SARAH2025"
  }
}

// Indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ "subscription.stripeCustomerId": 1 })
db.users.createIndex({ "metadata.lastActive": 1 })
```

#### Readings Collection
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  type: "decision", // "daily", "decision", "purchase"

  cards: [
    {
      cardId: "major-0-fool",
      position: 1,
      positionName: "Past/Situation",
      reversed: false,
      drawnAt: ISODate("2025-11-07T10:00:00Z")
    },
    {
      cardId: "swords-2",
      position: 2,
      positionName: "Present/Action",
      reversed: true,
      drawnAt: ISODate("2025-11-07T10:00:01Z")
    },
    {
      cardId: "cups-ace",
      position: 3,
      positionName: "Future/Outcome",
      reversed: false,
      drawnAt: ISODate("2025-11-07T10:00:02Z")
    }
  ],

  interpretation: {
    summary: "Your decision requires a leap of faith...",
    detailedAnalysis: "The Fool in the past position suggests...",
    actionableAdvice: "Consider taking calculated risks...",
    aiGeneratedInsights: "Based on your pattern of...",
    generatedBy: "gpt-4", // or "fallback"
    generationTimestamp: ISODate("2025-11-07T10:00:05Z"),
    tokensUsed: 850
  },

  decisionContext: {
    question: "Should I accept the new job offer?",
    options: [
      "Accept the offer and relocate",
      "Negotiate for remote work",
      "Decline and stay current job"
    ],
    chosenOption: "Negotiate for remote work",
    chosenAt: ISODate("2025-11-08T14:00:00Z"),
    outcome: "positive", // set later by user
    outcomeNotes: "They agreed to 3 days remote!",
    outcomeRecordedAt: ISODate("2025-11-15T18:00:00Z")
  },

  userFeedback: {
    rating: 5, // 1-5 stars
    accuracyRating: 4, // how accurate was prediction
    helpful: true,
    notes: "Really helped me see the options clearly",
    feedbackAt: ISODate("2025-11-15T18:05:00Z")
  },

  metadata: {
    createdAt: ISODate("2025-11-07T10:00:00Z"),
    viewCount: 8,
    shared: false,
    tags: ["career", "relocation"],
    archived: false
  }
}

// Indexes
db.readings.createIndex({ userId: 1, createdAt: -1 })
db.readings.createIndex({ type: 1, createdAt: -1 })
db.readings.createIndex({ "cards.cardId": 1 })
db.readings.createIndex({ "decisionContext.outcome": 1 })
```

#### Cards Collection (Static Reference Data)
```javascript
{
  _id: "major-0-fool",
  name: "The Fool",
  arcana: "major",
  number: 0,
  suit: null,

  imagery: {
    imageUrl: "https://cdn.example.com/cards/fool.webp",
    thumbnailUrl: "https://cdn.example.com/cards/fool-thumb.webp",
    artist: "Pamela Colman Smith",
    description: "A young person stands at cliff's edge..."
  },

  upright: {
    keywords: ["new beginnings", "innocence", "spontaneity", "free spirit"],
    shortMeaning: "New beginnings, taking a leap of faith",
    detailedMeaning: "The Fool represents the beginning of a journey...",
    advice: "Embrace new opportunities with an open heart...",
    love: "A new romantic adventure awaits...",
    career: "Time to take a career risk...",
    finance: "Be cautious with major financial decisions..."
  },

  reversed: {
    keywords: ["recklessness", "risk", "foolishness", "chaos"],
    shortMeaning: "Recklessness, poor judgment",
    detailedMeaning: "Reversed, The Fool warns of impulsive decisions...",
    advice: "Take time to think things through...",
    love: "Avoid rushing into relationships...",
    career: "Reconsider hasty career moves...",
    finance: "Avoid risky investments at this time..."
  },

  symbolism: [
    "White rose: purity and innocence",
    "Small dog: loyalty and protection",
    "Cliff edge: leap of faith",
    "Mountains: future challenges"
  ],

  metadata: {
    deck: "rider-waite",
    createdAt: ISODate("2025-01-01T00:00:00Z"),
    lastUpdated: ISODate("2025-01-01T00:00:00Z")
  }
}

// Indexes
db.cards.createIndex({ arcana: 1, number: 1 })
db.cards.createIndex({ "upright.keywords": 1 })
```

---

## API Architecture

### RESTful API Endpoints

#### Authentication Endpoints
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
GET    /api/v1/auth/oauth/google
GET    /api/v1/auth/oauth/facebook
```

#### Readings Endpoints
```
GET    /api/v1/readings                    # List user's readings
POST   /api/v1/readings/daily              # Generate daily reading
POST   /api/v1/readings/decision           # Create decision reading
POST   /api/v1/readings/purchase           # Quick purchase reading
GET    /api/v1/readings/:id                # Get reading details
PATCH  /api/v1/readings/:id/feedback       # Add user feedback
DELETE /api/v1/readings/:id                # Delete reading
```

#### Decisions Endpoints
```
GET    /api/v1/decisions                   # List decisions
GET    /api/v1/decisions/:id               # Get decision details
PATCH  /api/v1/decisions/:id/outcome       # Record outcome
GET    /api/v1/decisions/analytics         # Decision analytics
```

#### Users Endpoints
```
GET    /api/v1/users/me                    # Current user profile
PATCH  /api/v1/users/me                    # Update profile
GET    /api/v1/users/me/stats              # User statistics
GET    /api/v1/users/me/export             # Export user data (GDPR)
DELETE /api/v1/users/me                    # Delete account (GDPR)
```

#### Cards Endpoints
```
GET    /api/v1/cards                       # List all cards
GET    /api/v1/cards/:id                   # Get card details
GET    /api/v1/cards/random                # Draw random card
```

#### Subscriptions Endpoints
```
GET    /api/v1/subscriptions/plans         # List available plans
POST   /api/v1/subscriptions/checkout      # Create checkout session
GET    /api/v1/subscriptions/me            # Current subscription
POST   /api/v1/subscriptions/cancel        # Cancel subscription
POST   /api/v1/subscriptions/reactivate    # Reactivate subscription
```

#### Webhooks
```
POST   /api/v1/webhooks/stripe             # Stripe payment events
```

### API Response Format
```javascript
// Success Response
{
  success: true,
  data: {
    // Response payload
  },
  meta: {
    timestamp: "2025-11-07T10:00:00Z",
    version: "1.0"
  }
}

// Error Response
{
  success: false,
  error: {
    code: "INVALID_INPUT",
    message: "Email is required",
    details: {
      field: "email",
      value: null
    }
  },
  meta: {
    timestamp: "2025-11-07T10:00:00Z",
    requestId: "req_abc123"
  }
}
```

---

## Integration Architecture

### OpenAI Integration
```javascript
// AIService.js
class AIService {
  async generateInterpretation(cards, context) {
    const prompt = this.buildPrompt(cards, context);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: TAROT_EXPERT_SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return {
        interpretation: response.choices[0].message.content,
        tokensUsed: response.usage.total_tokens,
        source: "gpt-4"
      };
    } catch (error) {
      // Fallback to pre-generated interpretations
      return this.getFallbackInterpretation(cards, context);
    }
  }

  buildPrompt(cards, context) {
    // Structured prompt engineering
    return `
      You are an expert tarot reader. Provide an interpretation for:

      Cards drawn: ${cards.map(c => c.name).join(', ')}
      Context: ${context.question}
      Options: ${context.options.join(', ')}

      Provide:
      1. Overall reading summary (2-3 sentences)
      2. Detailed card-by-card analysis
      3. Actionable advice for the decision
      4. Risk assessment

      Tone: Empowering, insightful, practical
    `;
  }
}
```

### Notification Service Architecture
```javascript
// NotificationService.js
class NotificationService {
  async sendDailyReadingNotification(user) {
    const notification = {
      title: "Your Daily Card Awaits",
      body: "Start your day with guidance and clarity",
      data: {
        type: "daily_reading",
        userId: user._id
      }
    };

    // Firebase Cloud Messaging
    await this.fcm.send(user.fcmToken, notification);

    // Email fallback if push disabled
    if (!user.preferences.notificationsEnabled) {
      await this.sendEmail(user.email, notification);
    }
  }

  async scheduleDailyReadings() {
    // Runs via cron job at user-configured times
    const users = await User.find({
      "preferences.notificationsEnabled": true
    });

    for (const user of users) {
      await this.sendDailyReadingNotification(user);
    }
  }
}
```

---

## Security Architecture

### Authentication Flow
```
1. User submits credentials → API
2. API validates against DB
3. Generate JWT token (24hr expiry)
4. Return token + refresh token
5. Client stores token (secure storage)
6. Client includes token in Authorization header
7. Middleware validates token on each request
8. Refresh token used to get new access token
```

### Data Security Measures
- **Encryption at Rest**: AES-256 for sensitive fields (email, personal data)
- **Encryption in Transit**: TLS 1.3 for all API communications
- **Password Hashing**: bcrypt with salt rounds = 10
- **API Rate Limiting**: 100 req/min per user, 1000 req/min per IP
- **CORS Policy**: Whitelist only known origins
- **Input Validation**: Joi schemas for all endpoints
- **SQL/NoSQL Injection Prevention**: Parameterized queries, Mongoose sanitization

---

## Deployment Architecture

### AWS Infrastructure
```
┌─────────────────────────────────────────────────────┐
│                  CloudFront CDN                     │
│              (Static Assets + Cache)                │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              Elastic Load Balancer                  │
│           (SSL Termination + Routing)               │
└───────────┬───────────────────┬─────────────────────┘
            │                   │
┌───────────▼─────────┐  ┌──────▼──────────┐
│  EC2 Instance 1     │  │  EC2 Instance 2 │
│  (API Server)       │  │  (API Server)   │
│  - Node.js          │  │  - Node.js      │
│  - PM2              │  │  - PM2          │
└───────────┬─────────┘  └──────┬──────────┘
            │                   │
            └────────┬──────────┘
                     │
┌────────────────────▼─────────────────────┐
│         MongoDB Atlas                    │
│       (M10 Cluster + Replica Set)        │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│         AWS ElastiCache (Redis)          │
│        (Session + AI Cache)              │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│              AWS S3                      │
│    (Card Images + User Exports)          │
└──────────────────────────────────────────┘
```

---

## Performance Architecture

### Caching Strategy
```
┌─────────────────────────────────────────────────────┐
│                  CACHING LAYERS                     │
├─────────────────────────────────────────────────────┤
│ L1: Browser Cache (static assets, 7 days)          │
├─────────────────────────────────────────────────────┤
│ L2: CDN Cache (CloudFront, card images, 30 days)   │
├─────────────────────────────────────────────────────┤
│ L3: Redis Cache (sessions, AI results, 24 hours)   │
├─────────────────────────────────────────────────────┤
│ L4: MongoDB Indexes (optimized queries)            │
└─────────────────────────────────────────────────────┘
```

### Optimization Strategies
- **Lazy Loading**: Load reading history on scroll
- **Image Optimization**: WebP format, responsive sizes
- **Code Splitting**: Route-based chunks for faster initial load
- **API Response Compression**: Gzip compression
- **Database Query Optimization**: Compound indexes, aggregation pipelines

---

**Document Version**: 1.0
**Last Updated**: 2025-11-07
**Architecture Review**: Quarterly
