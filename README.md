# 🔮 AI Tarot Decision Assistant

> Помощник для принятия решений на основе Таро с Premium подпиской

[![License](https://img.shields.io/badge/license-Proprietary-red.svg)]()
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)]()
[![Status](https://img.shields.io/badge/MVP-85%25%20Complete-success.svg)]()

## 🎯 Обзор

AI Tarot Decision Assistant - это веб-приложение для принятия решений через расклады Таро. Платформа предлагает ежедневные расклады, анализ решений и премиум функции через систему подписок Stripe.

### ✨ Основные возможности

- **🌅 Расклад Дня**: Ежедневная карта с интерпретацией
- **🎯 Анализ Решения**: Расклад на 3 карты для сложных выборов
- **📖 История Раскладов**: Полная история с фильтрами
- **👤 Профиль**: Статистика, GDPR экспорт, управление аккаунтом
- **👑 Премиум**: Подписка через Stripe с расширенными функциями
- **📱 PWA**: Установка на устройства
- **🔌 Extension**: Chrome расширение для маркетплейсов
- **🇷🇺 Русский язык**: Полная локализация

## 🚀 Quick Start

### Development:

```bash
# 1. Установите зависимости
npm install
cd src/frontend && npm install && cd ../..

# 2. Настройте .env файл
cp .env.example .env
# Отредактируйте .env с вашими настройками

# 3. Засейдите карты Таро
npm run db:seed

# 4. Запустите development серверы
npm run dev
# Backend: http://localhost:4000
# Frontend: http://localhost:5173

# 5. Откройте в браузере
# http://localhost:5173
```

### Production Deployment:

```bash
# 1. Build frontend
npm run build

# 2. Проверка готовности
npm run deploy:check

# 3. Docker deployment
npm run docker:build
npm run docker:run

# Или Railway
npm run deploy:railway
```

**Подробнее**: См. [PRODUCTION-DEPLOYMENT-GUIDE.md](PRODUCTION-DEPLOYMENT-GUIDE.md)

---

## 📊 Tech Stack

**Backend:**
- Node.js 18+
- Express.js
- JWT Authentication
- Stripe Payments
- JSON Storage (MVP) / MongoDB (Production)

**Frontend:**
- React 18
- Redux Toolkit
- React Router
- Vite
- Axios

**DevOps:**
- Docker & Docker Compose
- Winston Logger
- Nodemon (dev)

---

## 🎴 Tarot Deck

**Current**: 34 карты
- 22 Старших Аркана (полная коллекция)
- 12 Младших Арканов (sample)

**Интерпретации**: 3 контекста × 2 ориентации × 3 варианта = 18 интерпретаций на карту

---

## 💰 Monetization

**Free Tier:**
- 1 расклад дня
- Базовый анализ решений
- 22 карты
- История 30 дней

**Premium (₽499/мес):**
- ✨ Неограниченные расклады
- 🔮 Все 78 карт
- 📊 Расширенная аналитика
- 📖 Полная история
- 💬 Приоритетная поддержка

---

## Project Structure

```
ai-tarot-decision-assistant/
├── CASCADE/                      # TOC Framework artifacts
│   ├── L0-STRATEGIC/             # Strategy and vision
│   │   ├── PRD.md                # Product Requirements Document
│   │   └── value-tree.md         # Value proposition mapping
│   ├── L1-CONSTRAINTS/           # Technical and resource constraints
│   │   └── technical-constraints.md
│   ├── L2-ARCHITECTURE/          # System design
│   │   └── system-architecture.md
│   ├── L3-PATTERNS/              # Reusable patterns
│   │   └── mvb-patterns.md       # MVB implementation patterns
│   ├── EXPERT/                   # Knowledge capture
│   └── ROADMAP.md                # 12-week implementation plan
│
├── src/
│   ├── frontend/                 # React web application
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── store/
│   ├── backend/                  # Node.js/Express API
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   ├── controllers/
│   │   │   └── middleware/
│   │   ├── services/
│   │   ├── models/
│   │   └── jobs/
│   └── shared/                   # Shared utilities
│
├── docs/                         # Additional documentation
├── config/                       # Configuration files
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## Getting Started

### Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **MongoDB**: >= 6.0 (local or Atlas)
- **Redis**: >= 7.0 (for caching)
- **OpenAI API Key**: For AI interpretations

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/ai-tarot-decision-assistant.git
   cd ai-tarot-decision-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Seed the database**
   ```bash
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts both the backend API (port 3000) and frontend dev server (port 5173).

### Quick Start Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run server:dev       # Start backend only
npm run client:dev       # Start frontend only

# Testing
npm test                 # Run all tests with coverage
npm run test:watch       # Watch mode for development

# Code Quality
npm run lint             # Lint all code
npm run format           # Format code with Prettier

# Database
npm run db:seed          # Seed database with tarot cards
npm run db:migrate       # Run database migrations

# Production
npm run build            # Build for production
npm start                # Start production server
```

## Technology Stack

### Frontend
- **React 18+** with TypeScript
- **Redux Toolkit** for state management
- **Vite** for build tooling
- **Material-UI / Tailwind CSS** for styling
- **React Native** for mobile apps

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Redis** for caching and queues
- **OpenAI GPT-4 API** for interpretations
- **Bull** for background jobs

### Infrastructure
- **AWS** (EC2, S3, CloudFront)
- **MongoDB Atlas** for production database
- **Stripe** for payments
- **Firebase** for push notifications
- **Sentry** for error tracking

## Development Workflow

### Phase 1: Foundation (Weeks 1-4)
Current focus on core features:
- ✅ Project setup and infrastructure
- 🔄 Authentication system
- 🔄 Daily reading engine
- 📋 Decision analysis feature
- 📋 User profiles and settings

See [ROADMAP.md](CASCADE/ROADMAP.md) for detailed timeline.

### Key Architecture Decisions

1. **AI Fallback System**: Pre-generated interpretations ensure availability during OpenAI API outages
2. **Freemium Model**: 1 free daily reading, premium unlocks unlimited access
3. **Cross-Platform Sync**: Server-side state with optimistic updates
4. **GDPR Compliance**: Built-in data export/deletion from day 1

See [system-architecture.md](CASCADE/L2-ARCHITECTURE/system-architecture.md) for technical details.

## API Documentation

### Authentication
```
POST /api/v1/auth/register     # Create new account
POST /api/v1/auth/login        # Login with credentials
POST /api/v1/auth/logout       # Logout current session
```

### Readings
```
GET  /api/v1/readings          # List user's readings
POST /api/v1/readings/daily    # Generate daily reading
POST /api/v1/readings/decision # Create decision reading
GET  /api/v1/readings/:id      # Get reading details
```

### Users
```
GET   /api/v1/users/me         # Current user profile
PATCH /api/v1/users/me         # Update profile
GET   /api/v1/users/me/stats   # User statistics
```

Full API documentation available at `/api/docs` when server is running.

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm test -- --coverage
```

### Test Coverage Goals
- **Unit Tests**: >80% coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user flows

## Contributing

This is a proprietary project. For internal team members:

1. Create a feature branch from `develop`
2. Make your changes with tests
3. Run linter and tests: `npm run lint && npm test`
4. Submit pull request to `develop`
5. Require 1 approval before merging

## Deployment

### Staging
```bash
git push origin develop
# Automatically deploys to staging via GitHub Actions
```

### Production
```bash
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin main --tags
# Manually trigger production deployment
```

## Monitoring & Operations

- **Uptime Monitoring**: UptimeRobot checks every 5 minutes
- **Error Tracking**: Sentry for backend and frontend errors
- **Analytics**: Mixpanel for user behavior, Google Analytics for traffic
- **Logs**: Winston logger with CloudWatch integration

## Support

- **Documentation**: See [CASCADE/](CASCADE/) for comprehensive docs
- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Team Chat**: Slack #ai-tarot-dev channel

## License

Proprietary - All rights reserved

## Project Status

**Current Phase**: Week 1 - Foundation Setup
**Next Milestone**: Week 4 - Core MVP Complete
**Target Launch**: Week 13

See [ROADMAP.md](CASCADE/ROADMAP.md) for detailed progress tracking.

---

Built with Theory of Constraints (TOC) methodology for maximum development velocity.
