# Technical Constraints Analysis

## Constraint Identification

### C1: OpenAI API Dependency
**Type**: External Service Dependency
**Severity**: HIGH
**Impact Area**: Core functionality (AI interpretations)

**Constraint Description**:
- All AI-generated card interpretations depend on OpenAI API
- API has rate limits: 3,500 requests/minute (tier-based)
- Cost per request: ~$0.01-0.02 for GPT-4 (varies by token usage)
- External service uptime not guaranteed (99.9% SLA)

**MVB Approach**:
1. **Immediate**: Implement fallback system with pre-generated interpretations
2. **Short-term**: Cache common reading patterns to reduce API calls
3. **Medium-term**: Add circuit breaker pattern for API failures
4. **Long-term**: Consider multi-provider strategy (Claude, Gemini)

**Measurement**:
- API call success rate > 99.5%
- Fallback usage < 1% of readings
- Average interpretation cost < $0.015 per reading

---

### C2: MongoDB Scaling at User Growth Inflection Points
**Type**: Infrastructure/Performance
**Severity**: MEDIUM-HIGH
**Impact Area**: Database performance, user experience

**Constraint Description**:
- Single MongoDB instance can handle ~10,000 concurrent users
- Reading history grows linearly with user engagement
- Complex queries (pattern analysis) become expensive at scale
- Indexing strategy critical for performance

**MVB Approach**:
1. **Immediate**: Design schema with sharding in mind (shard by userId)
2. **Short-term**: Implement Redis caching for frequent reads
3. **Medium-term**: Add read replicas for analytics queries
4. **Long-term**: Horizontal sharding when user count > 50K

**Measurement**:
- Query response time < 100ms (p95)
- Database CPU usage < 70%
- Cache hit rate > 80%

---

### C3: Mobile App Store Approval Risk
**Type**: Platform Policy
**Severity**: MEDIUM
**Impact Area**: Launch timeline, market access

**Constraint Description**:
- Apple App Store has strict policies on "fortune-telling" apps
- Apps must not claim medical/health benefits
- Review process can take 1-2 weeks
- Rejection requires resubmission delay

**MVB Approach**:
1. **Immediate**: Frame as "entertainment and reflection tool"
2. **Short-term**: Add prominent disclaimers ("for entertainment purposes")
3. **Medium-term**: Consult app store guidelines expert pre-submission
4. **Long-term**: Maintain compliance documentation

**Measurement**:
- App store approval on first submission (target)
- Compliance with all store guidelines
- No policy violation reports post-launch

---

### C4: Browser Extension Marketplace Permissions
**Type**: Platform Policy
**Severity**: MEDIUM
**Impact Area**: Extension functionality, user trust

**Constraint Description**:
- Chrome extension requires permissions to access product pages
- Users may distrust permissions request
- Manifest V3 restrictions on background scripts
- Extension can be removed from store for policy violations

**MVB Approach**:
1. **Immediate**: Request minimal permissions (activeTab only)
2. **Short-term**: Clear permission explanation during install
3. **Medium-term**: Privacy policy emphasizing no data collection
4. **Long-term**: Open-source extension code for transparency

**Measurement**:
- Extension install conversion rate > 15%
- Chrome Web Store rating > 4.3 stars
- Zero policy violations

---

### C5: React Native Performance on Older Devices
**Type**: Technology Performance
**Severity**: MEDIUM
**Impact Area**: User experience, market reach

**Constraint Description**:
- React Native can lag on Android devices < 2GB RAM
- Card animations may stutter on older iOS devices
- Large reading history may slow app on low-end devices

**MVB Approach**:
1. **Immediate**: Implement lazy loading for reading history
2. **Short-term**: Optimize card images (WebP format, compressed)
3. **Medium-term**: Performance profiling on target min-spec devices
4. **Long-term**: Consider native modules for critical animations

**Measurement**:
- App launch time < 3 seconds on min-spec device (iPhone 8, Android 10)
- 60 FPS for card animations
- Memory usage < 150MB

---

### C6: Real-Time Notification Delivery
**Type**: Infrastructure/UX
**Severity**: MEDIUM
**Impact Area**: Daily engagement, user retention

**Constraint Description**:
- Firebase Cloud Messaging has delivery delays (1-10 minutes)
- iOS requires APNS certificates and proper configuration
- Users can disable notifications at OS level
- Android battery optimization may kill background service

**MVB Approach**:
1. **Immediate**: Send notifications 5 minutes before target time
2. **Short-term**: Implement in-app fallback check for missed notifications
3. **Medium-term**: A/B test notification timing for optimal engagement
4. **Long-term**: Add SMS fallback for premium users (optional)

**Measurement**:
- Notification delivery rate > 95%
- Notification engagement rate > 30%
- Opt-out rate < 20%

---

### C7: Cross-Platform Code Sharing Limitations
**Type**: Development Complexity
**Severity**: MEDIUM
**Impact Area**: Development velocity, code maintainability

**Constraint Description**:
- React Native shares ~70% code with web (not 100%)
- Platform-specific UI patterns differ (iOS vs Android vs Web)
- Extension uses different build process than web app
- Debugging across platforms time-intensive

**MVB Approach**:
1. **Immediate**: Separate business logic from UI components
2. **Short-term**: Create platform-agnostic API client library
3. **Medium-term**: Implement comprehensive E2E tests per platform
4. **Long-term**: Maintain platform parity checklist

**Measurement**:
- Code reuse rate > 70% (business logic)
- Feature parity across platforms within 1 sprint
- Platform-specific bugs < 10% of total bugs

---

### C8: AI Interpretation Quality Consistency
**Type**: AI/ML Quality
**Severity**: MEDIUM-HIGH
**Impact Area**: User trust, satisfaction

**Constraint Description**:
- GPT-4 output can be inconsistent (temperature parameter)
- Hallucination risk (AI inventing card meanings)
- Interpretation length varies (token limits)
- Cultural sensitivity in interpretations

**MVB Approach**:
1. **Immediate**: Strict prompt engineering with validated tarot meanings
2. **Short-term**: Output validation against tarot card database
3. **Medium-term**: Human review of flagged interpretations
4. **Long-term**: Fine-tuned model on curated tarot dataset

**Measurement**:
- User satisfaction rating > 4.0/5 for interpretations
- Hallucination incidents < 0.1% of readings
- Interpretation consistency score > 85%

---

### C9: Data Privacy Compliance (GDPR)
**Type**: Legal/Regulatory
**Severity**: HIGH
**Impact Area**: European market access, legal risk

**Constraint Description**:
- GDPR requires explicit consent for data processing
- Users must be able to export and delete all data
- Reading history contains potentially sensitive information
- Cookie consent required for web analytics

**MVB Approach**:
1. **Immediate**: Implement data export/deletion endpoints
2. **Short-term**: Add GDPR-compliant consent flow
3. **Medium-term**: Data retention policies (auto-delete after N years)
4. **Long-term**: Privacy-by-design architecture review

**Measurement**:
- GDPR compliance audit passing
- Data export/deletion request fulfillment < 48 hours
- Zero privacy violations

---

### C10: Affiliate Link Attribution Tracking
**Type**: Technical/Monetization
**Severity**: MEDIUM
**Impact Area**: Revenue accuracy

**Constraint Description**:
- Affiliate cookies expire (24-hour to 30-day windows)
- Users may use ad blockers preventing tracking
- Multiple affiliate networks have different tracking methods
- Browser privacy features block third-party cookies

**MVB Approach**:
1. **Immediate**: Use first-party tracking with server-side attribution
2. **Short-term**: Implement deep linking where supported
3. **Medium-term**: Diversify across multiple affiliate networks
4. **Long-term**: Direct partnerships for better tracking

**Measurement**:
- Attribution accuracy > 80%
- Affiliate revenue per 1000 users > $50/month
- Cookie acceptance rate > 60%

---

## Constraint Prioritization Matrix

| Priority | Constraint | MVB Timeline | Risk if Ignored |
|----------|-----------|--------------|-----------------|
| P0 | C1: OpenAI API Dependency | Day 1-2 | App unusable during outages |
| P0 | C9: GDPR Compliance | Day 1-2 | Legal liability, EU market blocked |
| P1 | C3: App Store Approval | Day 3-4 | Launch delay, revenue impact |
| P1 | C8: AI Quality Consistency | Day 2-3 | User churn, poor ratings |
| P2 | C2: MongoDB Scaling | Day 2-3 | Performance degradation at scale |
| P2 | C4: Extension Permissions | Day 5-6 | Low extension adoption |
| P3 | C6: Notification Delivery | Day 3-4 | Reduced engagement |
| P3 | C5: React Native Performance | Day 4-5 | Poor UX on low-end devices |
| P3 | C7: Cross-Platform Sharing | Day 1 (architecture) | Development inefficiency |
| P4 | C10: Affiliate Tracking | Day 7-8 | Revenue leakage |

---

## Resource Constraints

### RC1: Development Team Size
**Constraint**: 2 full-stack developers for 12-day MVP
**Impact**: Limited parallel workstreams, feature prioritization critical

**MVB Approach**:
- Focus on core features first (daily reading, decision analysis)
- Defer advanced features (multiple spreads, community) to post-MVP
- Use third-party libraries aggressively (don't reinvent)
- Outsource design assets (card images, UI mockups)

---

### RC2: Budget Limitations
**Constraint**: $50,000 total budget for MVP + initial marketing
**Impact**: Must optimize infrastructure costs, limited paid acquisition

**Cost Breakdown**:
- Development: $30,000 (2 devs × 3 months)
- Infrastructure: $5,000 (AWS, OpenAI API, MongoDB Atlas)
- Design: $5,000 (UI/UX designer, card assets)
- Legal/Admin: $3,000 (business formation, compliance)
- Marketing: $7,000 (initial user acquisition, influencer partnerships)

**MVB Approach**:
- Use serverless architecture where possible (reduce fixed costs)
- Start with MongoDB free tier, upgrade as needed
- Optimize AI API usage (caching, fallbacks)
- Focus on organic growth (SEO, social sharing) over paid ads

---

### RC3: Timeline Pressure (12-Day MVP)
**Constraint**: Must launch within 12 days to capture market opportunity
**Impact**: Feature scope must be ruthlessly prioritized

**MVB Approach**:
- Use Agile 2-day sprints with clear deliverables
- Cut scope aggressively if timeline slips
- Accept technical debt in non-critical areas (document for future)
- Parallel development where possible (web + mobile)

---

## Technology Stack Constraints

### TS1: Node.js Single-Threaded Limitation
**Constraint**: Node.js event loop can bottleneck CPU-intensive tasks
**MVB**: Offload heavy processing (analytics) to background jobs (Bull queue)

### TS2: React Native Version Compatibility
**Constraint**: Must stay on stable React Native version (breaking changes common)
**MVB**: Pin to React Native 0.72 (LTS), upgrade post-MVP

### TS3: Chrome Extension Manifest V3
**Constraint**: Service workers replace background pages (lifecycle changes)
**MVB**: Design extension with intermittent connection assumption

---

## Mitigation Summary

### High-Priority Mitigations (Day 1-2)
1. Implement OpenAI API fallback system
2. GDPR-compliant data handling architecture
3. Design MongoDB schema for future sharding
4. AI prompt validation system

### Medium-Priority Mitigations (Day 3-6)
1. App store compliance review
2. Redis caching layer
3. Performance optimization for mobile
4. Extension permission UX

### Low-Priority Mitigations (Day 7-12)
1. Affiliate tracking optimization
2. Multi-provider AI integration prep
3. Advanced notification strategies

---

**Document Version**: 1.0
**Last Updated**: 2025-11-07
**Review Frequency**: Daily during MVP development
