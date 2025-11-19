# Product Requirements Document: AI Tarot Decision Assistant

## 1. Product Vision

**Mission**: Combine AI analytics with symbolic guidance for daily decision-making, helping users make more informed choices through the intersection of data-driven insights and intuitive wisdom.

**Value Proposition**:
- Transform decision anxiety into clarity using AI-powered analysis paired with tarot symbolism
- Bridge rational thinking and intuitive guidance in a single platform
- Provide actionable recommendations for everyday choices and purchases

**Target Audience**:
- **Primary Segment A**: Women 20-38 interested in esoteric practices, self-development, and mindfulness
- **Primary Segment B**: Men 25-40 using "rational intuition" for business and personal decisions
- **Secondary**: Anyone seeking decision-support tools with symbolic interpretation

## 2. Market Analysis

### Competitive Landscape

**Direct Competitors**:
- Labyrinthos Tarot Academy - educational focus, limited AI
- Golden Thread Tarot - beautiful design, no decision analytics
- Galaxy Tarot - basic readings, no purchase recommendations

**Indirect Competitors**:
- Decision matrix apps (too analytical, no symbolic layer)
- Meditation/mindfulness apps (broad wellness, not decision-focused)
- Shopping assistant tools (purely transactional, no reflection)

### Competitive Advantages

1. **Unique Integration**: First to combine AI decision analytics with tarot symbolism
2. **Browser Extension**: Marketplace integration for purchase decisions (unique in tarot space)
3. **Dual Appeal**: Serves both "mystical" and "rational" user personas
4. **AI-Powered Personalization**: Learning system adapts to user decision patterns
5. **Actionable Insights**: Beyond fortune-telling to practical recommendations

### Market Opportunity

- **Tarot App Market**: $50M+ annually (growing 15% YoY)
- **Decision Support Tools**: $2B+ market (B2C segment growing)
- **Wellness Tech**: $4.5B+ with high mobile engagement
- **Target Market Size**: 15M+ potential users (US + Europe)

## 3. User Stories & Scenarios

### Epic 1: Daily Guidance

**User Story 1.1**: As a professional woman, I want to receive a daily card reading each morning so I can start my day with clarity and intention.

**Acceptance Criteria**:
- Reading available at user-configured time (default 8:00 AM)
- Push notification with teaser text
- Full interpretation includes: card meaning, daily theme, actionable advice
- Ability to save favorite readings
- Reading history accessible for reflection

**User Story 1.2**: As a reflective user, I want to see how my daily cards relate to actual events so I can understand patterns in my life.

**Acceptance Criteria**:
- Optional "end of day" reflection prompt
- Ability to rate reading accuracy (1-5 stars)
- Pattern analysis showing recurring themes
- Monthly summary of card frequencies and correlations

### Epic 2: Decision Analysis

**User Story 2.1**: As someone facing a difficult choice, I want AI-powered analysis of my options so I can see multiple perspectives before deciding.

**Acceptance Criteria**:
- Input: decision description + 2-3 options
- Output: pros/cons for each option, risk assessment, recommended approach
- 3-card spread: Past/Present/Future or Situation/Action/Outcome
- AI interpretation connects cards to specific decision factors
- Save decision for later review

**User Story 2.2**: As a data-driven user, I want to track decision outcomes so I can improve my decision-making process over time.

**Acceptance Criteria**:
- Mark decisions as "resolved" with outcome
- Track accuracy of predictions vs. actual results
- Analytics dashboard showing decision success rate
- Pattern recognition: which card combinations predict better outcomes

### Epic 3: Purchase Guidance (Browser Extension)

**User Story 3.1**: As an online shopper, I want quick guidance on purchases so I can reduce buyer's remorse and shopping anxiety.

**Acceptance Criteria**:
- Extension detects product pages on major marketplaces (Amazon, eBay, etc.)
- "Get Tarot Guidance" button appears on product page
- Quick 1-card reading + AI analysis: "Should I buy this?"
- Considers: price vs. value, need vs. want, timing
- Links to affiliate if purchase aligns with reading

**User Story 3.2**: As a conscious consumer, I want to understand my shopping patterns so I can make more mindful purchases.

**Acceptance Criteria**:
- Dashboard showing purchase readings history
- Categories: impulse purchases, planned buys, rejected items
- Savings calculator (avoided purchases based on readings)
- Monthly spending insights with symbolic themes

### Epic 4: History & Learning

**User Story 4.1**: As a journal keeper, I want to review my reading history so I can track my personal growth journey.

**Acceptance Criteria**:
- Chronological view of all readings (daily, decisions, purchases)
- Filter by: date range, card, reading type, user rating
- Export options: PDF, CSV
- Private notes on each reading
- Search functionality

**User Story 4.2**: As a curious learner, I want to understand tarot symbolism so I can develop my own intuition.

**Acceptance Criteria**:
- Card encyclopedia with meanings
- Interactive card spreads tutorial
- Personalized learning based on frequently drawn cards
- "Ask about this card" AI chat feature

## 4. Functional Requirements

### Core Features (MVP - Day 1-4)

**F1: User Authentication**
- Email/password registration and login
- Social auth (Google, Facebook)
- Password reset flow
- Email verification

**F2: Daily Card Reading**
- Automated daily reading generation (8:00 AM default)
- Single card draw with detailed interpretation
- AI-generated personalized message based on user history
- Push notifications (configurable)

**F3: Decision Analysis (Basic)**
- Input form: decision description + 2-3 options
- 3-card tarot spread generation
- AI analysis connecting cards to decision factors
- Save/retrieve past decisions

**F4: Reading History**
- Chronological list of all readings
- Basic filtering (date, type)
- Individual reading detail view
- User notes on readings

### Enhanced Features (Day 5-8)

**F5: Browser Extension (MVP)**
- Chrome extension installable from Chrome Web Store
- Product page detection (Amazon priority)
- Single-card purchase guidance
- Integration with main app account

**F6: AI Personalization**
- User decision pattern analysis
- Adaptive interpretation based on past feedback
- Preferred card meanings learning
- Personalized daily themes

**F7: Analytics Dashboard**
- Decision success rate tracking
- Card frequency analysis
- Reading accuracy ratings over time
- Monthly pattern reports

### Advanced Features (Day 9-12)

**F8: Multiple Spread Types**
- Celtic Cross (10-card)
- Relationship spread
- Career guidance spread
- Custom spread builder

**F9: Community Features (Optional)**
- Anonymous decision sharing
- Crowd-sourced interpretations
- Expert reader consultations (marketplace)

**F10: Affiliate Integration**
- Tracked affiliate links in purchase guidance
- Commission tracking dashboard
- Smart product recommendations based on reading themes

## 5. Non-Functional Requirements

### Performance
- **Response Time**: Card readings generate in <2 seconds
- **AI Processing**: Decision analysis completes in <5 seconds
- **App Launch**: Mobile app launches in <3 seconds
- **Extension Load**: Browser extension overlay appears in <1 second

### Scalability
- **Concurrent Users**: Support 10,000+ simultaneous users
- **Database**: MongoDB with sharding for 1M+ users
- **API Rate Limits**: 100 requests/minute per user
- **CDN**: Static assets served via CDN (images, card assets)

### Security
- **Data Encryption**: AES-256 for data at rest, TLS 1.3 for transit
- **Authentication**: JWT tokens with 24-hour expiry
- **API Security**: Rate limiting, CORS policies, API key authentication
- **Privacy**: GDPR compliant, user data export/deletion on request
- **Payment Security**: PCI DSS compliant (via Stripe)

### Reliability
- **Uptime**: 99.5% availability SLA
- **Backup**: Automated daily database backups with 30-day retention
- **Error Handling**: Graceful degradation if OpenAI API unavailable
- **Monitoring**: Real-time error tracking (Sentry) and uptime monitoring

### Usability
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile Responsive**: Adaptive design for all screen sizes
- **Language**: English (MVP), Spanish & Russian (future)
- **Onboarding**: First-time user tutorial (<2 minutes)

### Compatibility
- **Web**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS 14+, Android 10+
- **Extension**: Chrome 90+, Firefox 88+ (MVP: Chrome only)

## 6. Technical Architecture

### Frontend Stack
- **Web App**: React 18+ with TypeScript
- **Mobile App**: React Native (shared codebase)
- **Browser Extension**: React + Chrome Extension Manifest V3
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI / Tailwind CSS
- **API Communication**: Axios with retry logic

### Backend Stack
- **API Server**: Node.js + Express.js
- **Database**: MongoDB (primary), Redis (caching)
- **Authentication**: JWT + Passport.js
- **AI Integration**: OpenAI API (GPT-4)
- **File Storage**: AWS S3 (user uploads, exports)
- **Email**: SendGrid
- **Push Notifications**: Firebase Cloud Messaging

### Third-Party Integrations
- **AI/ML**: OpenAI GPT-4 API for interpretations
- **Payments**: Stripe for subscriptions
- **Analytics**: Mixpanel for user behavior, Google Analytics
- **Error Tracking**: Sentry
- **Hosting**: AWS (EC2, RDS, S3, CloudFront)
- **Affiliate Networks**: Amazon Associates, ShareASale

### Data Models

**User**
```javascript
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  displayName: String,
  subscriptionTier: Enum['free', 'premium', 'pro'],
  subscriptionExpiry: Date,
  preferences: {
    dailyReadingTime: Time,
    notificationsEnabled: Boolean,
    theme: String
  },
  stats: {
    totalReadings: Number,
    decisionsMade: Number,
    accuracyRating: Number
  },
  createdAt: Date,
  lastActive: Date
}
```

**Reading**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: Enum['daily', 'decision', 'purchase'],
  cards: [{
    cardId: String,
    position: Number,
    reversed: Boolean
  }],
  interpretation: {
    summary: String,
    detailedAnalysis: String,
    actionableAdvice: String,
    aiGeneratedInsights: String
  },
  decisionContext: {
    question: String,
    options: [String],
    chosenOption: String,
    outcome: String
  },
  userFeedback: {
    rating: Number,
    notes: String,
    accuracyRating: Number
  },
  createdAt: Date
}
```

**Card** (Static Reference Data)
```javascript
{
  _id: String, // e.g., "major-0-fool"
  name: String,
  arcana: Enum['major', 'minor'],
  suit: String, // for minor arcana
  number: Number,
  upright: {
    keywords: [String],
    meaning: String,
    advice: String
  },
  reversed: {
    keywords: [String],
    meaning: String,
    advice: String
  },
  imagery: {
    imageUrl: String,
    symbolism: [String]
  }
}
```

## 7. Success Metrics & KPIs

### User Acquisition Metrics
- **Target**: 10,000 registered users in first 6 months
- **CAC (Customer Acquisition Cost)**: <$5 per user
- **Sign-up Conversion Rate**: 25%+ from landing page
- **Social Referral Rate**: 15%+ of new users from referrals

### Engagement Metrics
- **DAU (Daily Active Users)**: 30% of registered users
- **Session Duration**: Average 8+ minutes per session
- **Daily Reading Usage**: 60%+ of DAU perform daily reading
- **Decision Analysis Usage**: 20%+ of DAU use decision feature weekly
- **Retention**:
  - Day 1: 60%+
  - Day 7: 40%+
  - Day 30: 25%+

### Monetization Metrics
- **Free-to-Paid Conversion**: 5%+ convert to Premium within 30 days
- **Premium Subscription**: $4.99/month or $39.99/year
- **MRR (Monthly Recurring Revenue)**: $5,000 by month 6
- **ARPU (Average Revenue Per User)**: $0.50/month (blended)
- **Affiliate Revenue**: $500+/month from purchase guidance
- **LTV:CAC Ratio**: 3:1 target

### Product Quality Metrics
- **Reading Satisfaction**: 4.0+ star average rating
- **Decision Accuracy**: 70%+ users rate predictions as accurate
- **App Store Rating**: 4.5+ stars (iOS/Android)
- **Extension Rating**: 4.3+ stars (Chrome Web Store)
- **Crash Rate**: <1% of sessions
- **API Uptime**: 99.5%+

### Growth Metrics
- **Viral Coefficient**: 0.3+ (30% of users invite at least 1 friend)
- **Organic Traffic**: 40%+ of new users from SEO/word-of-mouth
- **Content Engagement**: 10%+ users share readings on social media
- **Browser Extension Installs**: 2,000+ in first 6 months

## 8. Roadmap & Milestones

### Phase 1: MVP Foundation (Days 1-4)

**Day 1-2: Core Infrastructure**
- Set up development environment
- Configure MongoDB database
- Implement user authentication (email/password)
- Create basic frontend scaffolding (React web app)
- Set up OpenAI API integration
- Deploy to staging environment

**Day 3-4: Core Features**
- Implement daily card reading feature
- Build basic decision analysis (3-card spread)
- Create reading history view
- Develop card encyclopedia
- Implement push notifications
- User profile and settings page

**Milestone 1 Criteria**:
- User can register, login, receive daily reading
- User can perform decision analysis
- User can view reading history
- All features functional on web platform

### Phase 2: Mobile & Extension (Days 5-8)

**Day 5-6: Mobile App**
- React Native app setup (iOS & Android)
- Port core features to mobile
- Implement mobile-specific notifications
- Add offline reading capability
- Beta testing with 50 users

**Day 7-8: Browser Extension (MVP)**
- Chrome extension development
- Amazon product page detection
- Purchase guidance feature (1-card reading)
- Extension-app account sync
- Chrome Web Store submission

**Milestone 2 Criteria**:
- Mobile apps functional on iOS & Android
- Browser extension live on Chrome Web Store
- 100+ beta users providing feedback
- Core features parity across all platforms

### Phase 3: AI Enhancement & Analytics (Days 9-10)

**Day 9: AI Personalization**
- Implement user pattern analysis
- Adaptive interpretation engine
- Personalized daily themes
- Decision success tracking

**Day 10: Analytics Dashboard**
- User analytics dashboard (card frequencies, patterns)
- Decision success rate tracking
- Monthly reports generation
- Export functionality (PDF, CSV)

**Milestone 3 Criteria**:
- AI personalization measurably improves user satisfaction
- Analytics dashboard provides actionable insights
- Users can track decision-making improvements
- Data export working reliably

### Phase 4: Monetization & Polish (Days 11-12)

**Day 11: Subscription System**
- Stripe integration for payments
- Premium tier features (unlimited readings, advanced spreads)
- Affiliate link tracking system
- Referral program

**Day 12: Launch Preparation**
- Performance optimization
- Security audit
- App store submissions (iOS, Android)
- Marketing website
- Launch campaigns preparation

**Milestone 4 (Launch) Criteria**:
- Payment system fully functional
- All app store approvals received
- 99%+ uptime over 7 days
- Marketing materials ready
- 500+ users in closed beta

### Post-Launch (Month 4-6)

**Month 4**:
- Additional spread types (Celtic Cross, Relationship)
- Social sharing features
- Community feed (optional)

**Month 5**:
- Multi-language support (Spanish, Russian)
- Expert reader marketplace (optional)
- Advanced affiliate integrations

**Month 6**:
- API for third-party integrations
- White-label offering for B2B
- Custom spread builder

## 9. Risks & Mitigation

### Technical Risks

**Risk T1: OpenAI API Dependency**
- **Impact**: High - Core feature depends on external API
- **Probability**: Medium - API outages or rate limits
- **Mitigation**:
  - Implement fallback to pre-generated interpretations
  - Cache common reading patterns
  - Consider alternative AI providers (Anthropic Claude)
  - Monitor API status and implement circuit breakers

**Risk T2: Mobile App Store Rejection**
- **Impact**: High - Delayed launch, revenue impact
- **Probability**: Medium - Tarot/fortune-telling apps sometimes flagged
- **Mitigation**:
  - Frame as "entertainment" not "medical advice"
  - Clear disclaimers throughout app
  - Follow all app store guidelines meticulously
  - Have legal review before submission

**Risk T3: Database Scaling**
- **Impact**: Medium - Performance degradation with growth
- **Probability**: Low-Medium - If user growth exceeds projections
- **Mitigation**:
  - Design with sharding in mind from day 1
  - Implement Redis caching aggressively
  - Monitor database performance continuously
  - Plan for MongoDB Atlas auto-scaling

### Business Risks

**Risk B1: Low User Acquisition**
- **Impact**: High - Insufficient users to reach monetization goals
- **Probability**: Medium - Competitive market
- **Mitigation**:
  - Allocate 20% budget to user acquisition testing
  - Build viral features (social sharing, referrals)
  - SEO-optimized content marketing
  - Partnerships with wellness influencers

**Risk B2: Poor Free-to-Paid Conversion**
- **Impact**: High - Revenue targets not met
- **Probability**: Medium - Freemium model challenging
- **Mitigation**:
  - A/B test premium features and pricing
  - Implement usage-based prompts (soft paywall)
  - Offer trial periods for premium
  - Clear value communication for paid tiers

**Risk B3: Affiliate Revenue Lower Than Expected**
- **Impact**: Medium - Secondary revenue stream underperforms
- **Probability**: Medium - Conversion rates uncertain
- **Mitigation**:
  - Diversify affiliate networks
  - Focus on high-commission categories
  - A/B test affiliate link placement
  - Consider alternative monetization (ads, tips)

### Market Risks

**Risk M1: Competitor Launches Similar Feature**
- **Impact**: Medium - Reduced differentiation
- **Probability**: Medium - Obvious feature gap in market
- **Mitigation**:
  - First-mover advantage through rapid MVP
  - Build strong brand identity early
  - Focus on superior UX and AI quality
  - Consider provisional patent for unique AI-tarot methodology

**Risk M2: Regulatory Changes**
- **Impact**: Medium-High - New regulations on AI or fortune-telling apps
- **Probability**: Low - But growing scrutiny on AI
- **Mitigation**:
  - Monitor regulatory landscape
  - Work with legal counsel on compliance
  - Design architecture for easy compliance adjustments
  - Maintain clear "for entertainment purposes" framing

## 10. Dependencies & Assumptions

### Technical Dependencies

**External Services**:
- OpenAI API availability and pricing stability
- MongoDB Atlas uptime and performance
- AWS infrastructure reliability
- Stripe payment processing
- Firebase Cloud Messaging for notifications
- App store approval processes

**Development Tools**:
- React/React Native ecosystem stability
- Node.js LTS support
- Chrome Extension Manifest V3 (no planned deprecation)

### Assumptions

**User Behavior Assumptions**:
- Users will engage with daily readings consistently
- Users trust AI-generated interpretations combined with traditional tarot
- Users willing to pay for enhanced features ($4.99/month acceptable)
- Browser extension users comfortable with marketplace integration

**Market Assumptions**:
- Wellness tech and mindfulness market continues growing
- Tarot/esoteric interest remains stable or increases
- No major negative press on AI fortune-telling apps
- Amazon and major marketplaces don't block product page extensions

**Technical Assumptions**:
- OpenAI API costs remain <$0.02 per reading
- MongoDB performance adequate for 100k+ users on standard tier
- React Native provides sufficient performance for mobile UX
- Chrome extension APIs remain stable (Manifest V3)

**Resource Assumptions**:
- Development team: 2 full-stack developers available full-time
- Budget: $50k for MVP development and initial marketing
- Timeline: 12 days achievable with dedicated team
- Design resources: 1 UI/UX designer available part-time

### Critical Success Factors

1. **AI Quality**: Interpretations must feel personalized and insightful
2. **User Trust**: Users must trust the guidance provided
3. **UX Simplicity**: Complex tarot concepts presented intuitively
4. **Performance**: Fast loading and response times essential for daily habit
5. **Monetization Balance**: Free tier valuable enough to build habit, paid tier compelling enough to convert
6. **Marketplace Integration**: Browser extension must feel helpful, not intrusive

---

**Document Version**: 1.0
**Last Updated**: 2025-11-07
**Owner**: Product Team
**Status**: Approved for MVP Development
