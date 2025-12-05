-- Supabase Schema for AI Tarot Decision Assistant
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_expiry TIMESTAMPTZ,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),

  -- Birth Info (JSONB for flexibility)
  birth_info JSONB DEFAULT '{
    "fullName": null,
    "birthDate": null,
    "birthTime": null,
    "birthCity": null,
    "birthCountry": null,
    "timezone": null,
    "latitude": null,
    "longitude": null
  }'::jsonb,

  -- Astrology Profile
  astrology_profile JSONB DEFAULT '{
    "sunSign": null,
    "moonSign": null,
    "risingSign": null,
    "calculated": false
  }'::jsonb,

  -- Preferences
  preferences JSONB DEFAULT '{
    "theme": "auto",
    "notificationsEnabled": true,
    "language": "ru",
    "useAstrology": false
  }'::jsonb,

  -- Stats
  stats JSONB DEFAULT '{
    "totalReadings": 0,
    "decisionsMade": 0,
    "currentStreak": 0,
    "longestStreak": 0,
    "lastReadingDate": null
  }'::jsonb,

  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);

-- ============================================
-- READINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'daily', 'decision', 'celtic-cross', etc.
  question TEXT,

  -- Cards drawn (JSONB array)
  cards JSONB DEFAULT '[]'::jsonb,

  -- Interpretation
  interpretation TEXT,

  -- User context (mood, energy, etc.)
  user_context JSONB DEFAULT '{}'::jsonb,

  -- Spread specific data
  spread_data JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for readings
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_type ON readings(type);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_readings_user_type ON readings(user_id, type);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Policies for service role (backend access)
-- Note: Service role bypasses RLS by default

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_readings_updated_at
  BEFORE UPDATE ON readings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CARDS TABLE (static tarot card data)
-- ============================================
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  arcana VARCHAR(50), -- 'major' or 'minor'
  suit VARCHAR(50), -- 'wands', 'cups', 'swords', 'pentacles' (for minor arcana)
  number INTEGER,
  keywords JSONB DEFAULT '[]'::jsonb,
  meaning_upright TEXT,
  meaning_reversed TEXT,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cards_arcana ON cards(arcana);
CREATE INDEX IF NOT EXISTS idx_cards_suit ON cards(suit);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  notification JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'queued',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);

-- ============================================
-- JOURNAL TABLE (reading notes)
-- ============================================
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reading_id UUID REFERENCES readings(id) ON DELETE CASCADE,
  note TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  mood VARCHAR(50),
  insights TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_reading_id ON journal_entries(reading_id);
