# Changelog

All notable changes to AI Tarot Decision Assistant will be documented in this file.

## [1.0.0] - 2025-11-14

### 🎉 Initial Release - MVP Complete!

#### Added

**Core Features:**
- User authentication (JWT with refresh tokens)
- Daily tarot reading (one per day limit)
- Decision analysis (3-card spread)
- Reading history with filters
- User profile management
- GDPR compliance (data export/delete)

**Tarot System:**
- Complete 78-card tarot deck
  - 22 Major Arcana
  - 56 Minor Arcana (14 cards × 4 suits)
- 1,404 interpretations in Russian
- 3 contexts (daily, decision, purchase)
- 2 orientations (upright, reversed)
- Suit-specific icons (🔥💧⚔️⭐🔮)

**Gamification:**
- Daily streak tracking
- Achievement system (10 badges)
- Statistics dashboard
- Progress tracking

**Premium Features:**
- Stripe payment integration
- Subscription management
- Premium tier system
- Feature gating

**Analytics:**
- Card frequency visualization
- Reading types distribution
- Monthly activity charts
- Personal insights dashboard

**UX Enhancements:**
- 6-step onboarding tutorial
- Dark/Light theme switcher
- Toast notifications
- Mood tracking (8 emotions)
- Voice reading (Text-to-Speech)
- Social sharing (VK, Telegram, WhatsApp)
- PDF export for readings
- Outcome tracking for decisions
- Learning quiz system

**Admin Tools:**
- Admin panel with system stats
- User management dashboard
- Access control

**Technical:**
- PWA support (manifest + service worker)
- Docker configuration
- Production environment setup
- Integration test suite (33 tests)
- Winston logging
- Health check endpoint

#### Changed
- Replaced MongoDB with JSON Storage for MVP (faster development)
- Enhanced card placeholders with suit-specific icons
- Optimized bundle size (91kb gzipped)

#### Security
- Helmet.js security headers
- CORS protection
- Rate limiting (50 req/15min)
- bcrypt password hashing
- Input validation

---

## [Future Releases]

### Planned for v1.1.0
- MongoDB migration (when >1000 users)
- Real tarot card images
- AI-powered personalized interpretations
- Mobile apps (iOS/Android)
- Additional spread types (Celtic Cross, etc.)

### Planned for v1.2.0
- Community features
- Social auth (Google, Facebook)
- Multi-language support
- Advanced analytics

---

## Version History

- **v1.0.0** (2025-11-14) - Initial MVP Release
- **v0.1.0** (2025-11-07) - Development started

---

**Note**: This project follows [Semantic Versioning](https://semver.org/).
