import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { lazy, Suspense } from 'react'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import DailyReadingPage from './pages/DailyReadingPage'
import DecisionPage from './pages/DecisionPage'
import ProfilePage from './pages/ProfilePage'

// Lazy load spread pages for code splitting
const CelticCrossPage = lazy(() => import('./pages/CelticCrossPage'))
const RelationshipSpreadPage = lazy(() => import('./pages/RelationshipSpreadPage'))
const CareerPathPage = lazy(() => import('./pages/CareerPathPage'))
const YearAheadPage = lazy(() => import('./pages/YearAheadPage'))
const YearSpreadPage = lazy(() => import('./pages/YearSpreadPage'))
const YesNoSpreadPage = lazy(() => import('./pages/YesNoSpreadPage'))
const LoveSpreadPage = lazy(() => import('./pages/LoveSpreadPage'))
const FinanceSpreadPage = lazy(() => import('./pages/FinanceSpreadPage'))
const BirthdaySpreadPage = lazy(() => import('./pages/BirthdaySpreadPage'))
const PastPresentFuturePage = lazy(() => import('./pages/PastPresentFuturePage'))

// Lazy load heavy pages for better performance
const HistoryPage = lazy(() => import('./pages/HistoryPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const NatalChartPage = lazy(() => import('./pages/NatalChartPage'))
const NumerologyPage = lazy(() => import('./pages/NumerologyPage'))
const MoonCalendarPage = lazy(() => import('./pages/MoonCalendarPage'))
const JournalPage = lazy(() => import('./pages/JournalPage'))
const CardsPage = lazy(() => import('./pages/CardsPage'))
const LearnPage = lazy(() => import('./pages/LearnPage'))
const QuizPage = lazy(() => import('./pages/QuizPage'))

// Regular imports for lightweight pages
import PremiumPage from './pages/PremiumPage'
import AdminPage from './pages/AdminPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import CompatibilityPage from './pages/CompatibilityPage'
import PersonalityTestsPage from './pages/PersonalityTestsPage'
import MediumConsultationPage from './pages/MediumConsultationPage'
import AboutPage from './pages/AboutPage'
import AchievementsPage from './pages/AchievementsPage'
import './App.css'

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()

  // Hide footer on login/register/landing pages
  const showFooter = !['/login', '/register', '/landing'].includes(location.pathname)

  return (
    <div className="app">
      <Suspense fallback={
        <div className="app-loading">
          <div className="loading-content">
            <div className="loading-icon">🔮</div>
            <div className="loading-spinner"></div>
            <p className="loading-text">Загрузка...</p>
          </div>
        </div>
      }>
        <Routes>
        {/* Public Routes */}
        <Route path="/landing" element={<LandingPage />} />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route path="/reading/daily" element={<DailyReadingPage />} />
        <Route path="/decision" element={<DecisionPage />} />
        <Route path="/reading/celtic-cross" element={<CelticCrossPage />} />
        <Route path="/reading/relationship" element={<RelationshipSpreadPage />} />
        <Route path="/reading/career-path" element={<CareerPathPage />} />
        <Route path="/reading/year-ahead" element={<YearAheadPage />} />
        <Route path="/reading/year-spread" element={<YearSpreadPage />} />
        <Route path="/reading/yes-no" element={<YesNoSpreadPage />} />
        <Route path="/reading/love" element={<LoveSpreadPage />} />
        <Route path="/reading/finance" element={<FinanceSpreadPage />} />
        <Route path="/reading/birthday" element={<BirthdaySpreadPage />} />
        <Route path="/reading/past-present-future" element={<PastPresentFuturePage />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/history"
          element={isAuthenticated ? <HistoryPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/premium"
          element={isAuthenticated ? <PremiumPage /> : <Navigate to="/login" />}
        />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route
          path="/analytics"
          element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/achievements"
          element={isAuthenticated ? <AchievementsPage /> : <Navigate to="/login" />}
        />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/natal-chart" element={<NatalChartPage />} />
        <Route path="/compatibility" element={<CompatibilityPage />} />
        <Route path="/tests" element={<PersonalityTestsPage />} />
        <Route path="/medium-consultation" element={<MediumConsultationPage />} />
        <Route path="/numerology" element={<NumerologyPage />} />
        <Route path="/moon-calendar" element={<MoonCalendarPage />} />
        <Route
          path="/journal"
          element={isAuthenticated ? <JournalPage /> : <Navigate to="/login" />}
        />

        {/* Default Route */}
        <Route
          path="/"
          element={<LandingPage />}
        />
      </Routes>
      </Suspense>

      {showFooter && <Footer />}
    </div>
  )
}

export default App
