import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import { useToast } from '../hooks/useToast'
import Toast from '../components/Toast'
import CityAutocomplete from '../components/CityAutocomplete'
import NatalChartWheel from '../components/NatalChartWheel'
import { ZODIAC_DETAILED, HOUSE_MEANINGS } from '../utils/zodiacKnowledge'
import { MERCURY_IN_SIGNS, VENUS_IN_SIGNS, MARS_IN_SIGNS, JUPITER_IN_SIGNS, SATURN_IN_SIGNS, URANUS_IN_SIGNS, NEPTUNE_IN_SIGNS, PLUTO_IN_SIGNS } from '../utils/planetsInSigns'
import { getAspectInterpretation } from '../utils/aspectInterpretations'
import { ELEMENT_DETAILED, getElementBalanceAnalysis } from '../utils/elementMeanings'
import { NatalChartSEO } from '../components/SEO'
import './NatalChartPage.css'

// Simple zodiac info for quick access
const ZODIAC_INFO = Object.fromEntries(
  Object.entries(ZODIAC_DETAILED).map(([name, data]) => [
    name,
    { icon: data.icon, element: data.element }
  ])
)

function NatalChartPage() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const toast = useToast()

  const [astroData, setAstroData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [expandedSections, setExpandedSections] = useState({})
  const [aspectFilter, setAspectFilter] = useState('all') // all, harmonious, neutral, challenging
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthCity: '',
    birthCountry: 'Россия',
    latitude: null,
    longitude: null,
    timezone: null
  })

  const handleCitySelect = (cityData) => {
    setFormData({
      ...formData,
      birthCity: cityData.city,
      latitude: cityData.latitude,
      longitude: cityData.longitude,
      timezone: cityData.timezone
    })
  }

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  useEffect(() => {
    if (token) {
      loadAstrologyData()
    } else {
      setLoading(false)
      setEditing(true) // Show form immediately for non-authenticated users
    }
  }, [token])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const toggleAllSections = useCallback(() => {
    const allSectionKeys = ['sun', 'moon', 'rising', 'mercury-key', 'venus-key', 'mars-key', 'jupiter-key', 'saturn-key', 'uranus-key', 'neptune-key', 'pluto-key', 'element-balance', 'strengths', 'challenges', 'life-lesson', 'soul-purpose']
    const allExpanded = allSectionKeys.every(key => expandedSections[key])

    const newState = {}
    allSectionKeys.forEach(key => {
      newState[key] = !allExpanded
    })
    setExpandedSections(newState)
  }, [expandedSections])

  const loadAstrologyData = async () => {
    try {
      const response = await axios.get('/users/astrology')
      setAstroData(response.data.data)

      if (response.data.data.birthInfo) {
        setFormData({
          fullName: response.data.data.birthInfo.fullName || '',
          birthDate: response.data.data.birthInfo.birthDate || '',
          birthTime: response.data.data.birthInfo.birthTime || '',
          birthCity: response.data.data.birthInfo.birthCity || '',
          birthCountry: response.data.data.birthInfo.birthCountry || 'Россия',
          latitude: response.data.data.birthInfo.latitude,
          longitude: response.data.data.birthInfo.longitude,
          timezone: response.data.data.birthInfo.timezone
        })
      }
    } catch (error) {
      console.error('Load astrology error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (token) {
        // Save to server for authenticated users
        await axios.put('/users/birth-info', formData)
        toast.success('Натальная карта рассчитана и сохранена!')
        await loadAstrologyData()
      } else {
        // Calculate for non-authenticated users (without saving)
        const response = await axios.post('/astrology/calculate-temp', formData)
        console.log('API Response:', response.data)
        console.log('Setting astroData with:', {
          astrologyProfile: response.data.data,
          birthInfo: formData
        })
        // response.data.data is the full astrologyProfile with calculated flag
        setAstroData({
          astrologyProfile: response.data.data,
          birthInfo: formData
        })
        toast.success('Натальная карта рассчитана! Войдите чтобы сохранить.')
      }
      setEditing(false)
    } catch (error) {
      console.error('Calculate natal chart error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)

      const errorMessage = error.response?.data?.error?.message
        || error.response?.data?.message
        || error.message
        || 'Ошибка расчёта натальной карты'

      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const hasAstroData = astroData?.astrologyProfile?.calculated

  return (
    <div className="natal-chart-page">
      <NatalChartSEO />
      {toast.toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} duration={t.duration} onClose={() => toast.hideToast(t.id)} />
      ))}

      <header className="reading-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">← Назад</button>
        <h1>🌟 Натальная Карта + Таро</h1>
      </header>

      {/* Sidebar Navigation */}
      {!loading && hasAstroData && showSidebar && (
        <aside className="natal-sidebar">
          <button className="sidebar-toggle" onClick={() => setShowSidebar(false)}>
            ◀ Скрыть
          </button>
          <div className="sidebar-title">Навигация</div>
          <nav className="sidebar-nav">
            <a href="#big-three" onClick={(e) => { e.preventDefault(); scrollToSection('big-three'); }}>
              ⭐ Большая Тройка
            </a>
            <a href="#interpretation" onClick={(e) => { e.preventDefault(); scrollToSection('interpretation'); }}>
              📖 Интерпретация (16)
            </a>
            <a href="#wheel" onClick={(e) => { e.preventDefault(); scrollToSection('wheel'); }}>
              🔮 Круг Карты
            </a>
            <a href="#planets" onClick={(e) => { e.preventDefault(); scrollToSection('planets'); }}>
              🪐 Планеты
            </a>
            <a href="#houses" onClick={(e) => { e.preventDefault(); scrollToSection('houses'); }}>
              🏠 Дома
            </a>
            <a href="#aspects" onClick={(e) => { e.preventDefault(); scrollToSection('aspects'); }}>
              🔗 Планетарные Связи
            </a>
            <a href="#elements" onClick={(e) => { e.preventDefault(); scrollToSection('elements'); }}>
              🔥💧 Баланс Элементов
            </a>
          </nav>
        </aside>
      )}

      {!showSidebar && !loading && hasAstroData && (
        <button className="sidebar-show-btn" onClick={() => setShowSidebar(true)}>
          ▶ Навигация
        </button>
      )}

      <main className="natal-content">
        {loading && <div className="loading">Загрузка...</div>}

        {!loading && !hasAstroData && !editing && (
          <div className="astro-welcome">
            <div className="welcome-icon">🔮✨</div>
            <h2>Узнайте свою натальную карту</h2>
            <p>Введите данные рождения для персонализированных раскладов Таро</p>
            <p className="astro-benefit">
              Ваш знак зодиака, Луна и восходящий знак помогут глубже понять расклады!
            </p>
            <button onClick={() => setEditing(true)} className="btn-primary">
              📝 Ввести Данные Рождения
            </button>
          </div>
        )}

        {editing && (
          <div className="birth-info-form">
            <h2>Данные Рождения</h2>
            <p className="form-description">
              Для точного расчёта натальной карты нужны дата, время и место рождения
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Полное Имя</label>
                <input type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Иван Иванов" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Дата Рождения *</label>
                  <input type="date" value={formData.birthDate} onChange={(e) => setFormData({...formData, birthDate: e.target.value})} required />
                </div>

                <div className="form-group">
                  <label>Время Рождения</label>
                  <input type="time" value={formData.birthTime} onChange={(e) => setFormData({...formData, birthTime: e.target.value})} />
                  <small>Для расчёта восходящего знака</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Город Рождения</label>
                  <CityAutocomplete value={formData.birthCity} onChange={(city) => setFormData({...formData, birthCity: city})} onCitySelect={handleCitySelect} />
                  <small>Начните вводить - появятся подсказки</small>
                </div>

                <div className="form-group">
                  <label>Страна</label>
                  <input type="text" value={formData.birthCountry} onChange={(e) => setFormData({...formData, birthCountry: e.target.value})} placeholder="Россия" />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Рассчитываем...' : '✨ Рассчитать Натальную Карту'}
                </button>
                {hasAstroData && (
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Отмена</button>
                )}
              </div>
            </form>
          </div>
        )}

        {!loading && hasAstroData && !editing && astroData.astrologyProfile && (
          <div className="astrology-results">
            <div className="astro-header">
              <h2>Ваша Натальная Карта</h2>
              <button onClick={() => setEditing(true)} className="btn-secondary">✏️ Редактировать</button>
            </div>

            {/* Notice if old data format */}
            {!astroData.astrologyProfile.sunInterpretation && (
              <div className="update-notice">
                <p>💡 <strong>Обновление доступно!</strong> Нажмите "Редактировать" и сохраните данные заново чтобы получить полные интерпретации всех 12 знаков зодиака с детальной информацией.</p>
              </div>
            )}

            {/* Unified Big Three Card */}
            <div className="big-three-unified-card">
              <div className="big-three-header">
                <h2>⭐ Ваша Полная Астрологическая Карта</h2>
                <p className="big-three-subtitle">Десять ключевых планет вашей личности</p>
              </div>

              <div className="big-three-grid">
                {/* Sun */}
                {astroData.astrologyProfile.sunSign && (
                  <div className="big-three-item sun">
                    <div className="bt-icon-large">☀️</div>
                    <div className="bt-sign-symbol">{ZODIAC_INFO[astroData.astrologyProfile.sunSign.sign]?.icon}</div>
                    <h3 className="bt-title">Солнце</h3>
                    <div className="bt-sign-name">{astroData.astrologyProfile.sunSign.sign}</div>
                    <div className="bt-element">{ZODIAC_INFO[astroData.astrologyProfile.sunSign.sign]?.element}</div>
                    <div className="bt-meaning">Ваша сущность и эго</div>
                    <div className="bt-ruler">Управитель: {astroData.astrologyProfile.sunSign.planet}</div>
                  </div>
                )}

                {/* Moon */}
                {astroData.astrologyProfile.moonSign && (
                  <div className="big-three-item moon">
                    <div className="bt-icon-large">🌙</div>
                    <div className="bt-sign-symbol">{ZODIAC_INFO[astroData.astrologyProfile.moonSign.sign]?.icon}</div>
                    <h3 className="bt-title">Луна</h3>
                    <div className="bt-sign-name">{astroData.astrologyProfile.moonSign.sign}</div>
                    <div className="bt-element">{ZODIAC_INFO[astroData.astrologyProfile.moonSign.sign]?.element}</div>
                    <div className="bt-meaning">Эмоции и чувства</div>
                    <div className="bt-ruler">Управитель: {ZODIAC_DETAILED[astroData.astrologyProfile.moonSign.sign]?.ruler}</div>
                  </div>
                )}

                {/* Rising */}
                {astroData.astrologyProfile.risingSign && (
                  <div className="big-three-item rising">
                    <div className="bt-icon-large">⬆️</div>
                    <div className="bt-sign-symbol">{ZODIAC_INFO[astroData.astrologyProfile.risingSign.sign]?.icon}</div>
                    <h3 className="bt-title">Восходящий</h3>
                    <div className="bt-sign-name">{astroData.astrologyProfile.risingSign.sign}</div>
                    <div className="bt-element">{ZODIAC_INFO[astroData.astrologyProfile.risingSign.sign]?.element}</div>
                    <div className="bt-meaning">Внешность и маска</div>
                    <div className="bt-ruler">Управитель: {ZODIAC_DETAILED[astroData.astrologyProfile.risingSign.sign]?.ruler}</div>
                  </div>
                )}
              </div>
            </div>

            {astroData.astrologyProfile.personalizedContext && (
              <div className="astro-context">
                <h3>🔮 Астрологический Контекст для Таро</h3>
                <p>{astroData.astrologyProfile.personalizedContext}</p>
              </div>
            )}

            <div className="astro-info-box">
              <h4>💡 Как это влияет на расклады?</h4>
              <ul>
                <li>Интерпретации адаптируются под ваш знак зодиака</li>
                <li>Карты Таро вашего знака имеют особое значение</li>
                <li>Элемент знака (Огонь/Земля/Воздух/Вода) влияет на советы</li>
                <li>Луна и восходящий добавляют глубину анализу</li>
                <li><strong>В раскладе дня вы получаете гороскоп + совет что делать!</strong></li>
              </ul>
            </div>

            <div className="interpretation-section" id="interpretation">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <h3 style={{margin: 0}}>📖 Интерпретация Вашей Карты</h3>
                <button onClick={toggleAllSections} className="btn-secondary" style={{fontSize: '13px', padding: '8px 16px'}}>
                  {Object.values(expandedSections).some(v => v) ? '▲ Свернуть всё' : '▼ Развернуть всё'}
                </button>
              </div>
              <p className="section-intro">16 ключевых аспектов вашей натальной карты - полный путь от рождения до предназначения души</p>

              {/* Sun Sign - Primary */}
              {astroData.astrologyProfile.sunSign && (
                <div className="interpretation-block expandable primary-sign">
                  <div className="block-header" onClick={() => toggleSection('sun')}>
                    <div className="header-content">
                      <div className="sign-hierarchy-badge primary">Основной Знак</div>
                      <h4>☀️ Солнце в {astroData.astrologyProfile.sunSign.sign}</h4>
                    </div>
                    <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('sun'); }}>
                      {expandedSections.sun ? '▲ Свернуть' : '▼ Развернуть'}
                    </button>
                  </div>

                  <p className="short-desc">
                    <strong>Ваша сущность:</strong> Это то, кто вы есть на самом деле. Ваша личность, эго и жизненная сила.
                  </p>

                  {expandedSections.sun && (
                    <div className="detailed-content">
                      {(() => {
                        const signData = ZODIAC_DETAILED[astroData.astrologyProfile.sunSign.sign]
                        return (
                          <>
                            <div className="sign-meta-info">
                              <div className="meta-item">
                                <strong>Элемент:</strong> {signData?.element}
                              </div>
                              <div className="meta-item">
                                <strong>Качество:</strong> {signData?.quality}
                              </div>
                              <div className="meta-item">
                                <strong>Планета-управитель:</strong> {signData?.ruler}
                              </div>
                              <div className="meta-item">
                                <strong>Даты:</strong> {signData?.dates}
                              </div>
                              <div className="meta-item">
                                <strong>Цвет силы:</strong> {signData?.color}
                              </div>
                              <div className="meta-item">
                                <strong>Камень:</strong> {signData?.stone}
                              </div>
                            </div>

                            <div className="sign-description-box">
                              <h5>🌟 Сущность знака:</h5>
                              <div className="full-interpretation" style={{whiteSpace: 'pre-line'}}>
                                {signData?.fullInterpretation?.personality}
                              </div>
                            </div>

                            {/* Keywords from knowledge base */}
                            <div className="sign-keywords">
                              <h5>🔑 Ключевые Качества:</h5>
                              <div className="keywords-grid">
                                {signData?.keywords?.map((kw, idx) => (
                                  <span key={idx} className="keyword-tag">{kw}</span>
                                ))}
                              </div>
                            </div>

                            {/* Strengths & Weaknesses from knowledge base */}
                            <div className="traits-grid">
                              <div className="trait-box positive">
                                <h5>✨ Сильные Стороны:</h5>
                                <ul>
                                  {signData?.fullInterpretation?.strengths?.map((trait, idx) => (
                                    <li key={idx}>{trait}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="trait-box negative">
                                <h5>⚡ Области Роста:</h5>
                                <ul>
                                  {signData?.fullInterpretation?.weaknesses?.map((trait, idx) => (
                                    <li key={idx}>{trait}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Life Areas from knowledge base */}
                            <div className="life-areas-section">
                              <div className="life-area-card love">
                                <h5>💕 Любовь и Отношения</h5>
                                <p>{signData?.fullInterpretation?.love}</p>
                              </div>

                              <div className="life-area-card career">
                                <h5>💼 Карьера и Призвание</h5>
                                <p>{signData?.fullInterpretation?.career}</p>
                              </div>
                            </div>

                            {/* Compatibility from knowledge base */}
                            <div className="compatibility-box">
                              <h5>💕 Совместимость с знаками:</h5>
                              <div className="compatibility-signs">
                                {signData?.fullInterpretation?.compatibility?.map((sign, idx) => (
                                  <span key={idx} className="compatible-sign">
                                    {ZODIAC_INFO[sign]?.icon} {sign}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Tarot Connection from knowledge base */}
                            <div className="tarot-connection-detailed">
                              <h5>🎴 Связь с Таро:</h5>
                              <p>{signData?.tarotConnection}</p>
                              {astroData.astrologyProfile.sunSign.tarotCards?.length > 0 && (
                                <div className="personal-tarot-card">
                                  <strong>Ваша карта силы:</strong> {astroData.astrologyProfile.sunSign.tarotCards[0]}
                                  <p className="card-advice">
                                    Когда эта карта появляется в раскладах, обращайте особое внимание -
                                    это прямое послание для вас!
                                  </p>
                                </div>
                              )}
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Moon Sign - Secondary */}
              {astroData.astrologyProfile.moonSign && (
                <div className="interpretation-block expandable secondary-sign">
                  <div className="block-header" onClick={() => toggleSection('moon')}>
                    <div className="header-content">
                      <div className="sign-hierarchy-badge secondary">Эмоциональная Природа</div>
                      <h4>🌙 Луна в {astroData.astrologyProfile.moonSign.sign}</h4>
                    </div>
                    <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('moon'); }}>
                      {expandedSections.moon ? '▲ Свернуть' : '▼ Развернуть'}
                    </button>
                  </div>

                  <p className="short-desc">
                    <strong>Ваши эмоции:</strong> Как вы чувствуете, что вам нужно для комфорта, ваши инстинкты.
                  </p>

                  {expandedSections.moon && (
                    <div className="detailed-content">
                      {(() => {
                        const moonData = ZODIAC_DETAILED[astroData.astrologyProfile.moonSign.sign]
                        return (
                          <>
                            <div className="sign-meta-info">
                              <div className="meta-item">
                                <strong>Элемент:</strong> {moonData?.element}
                              </div>
                              <div className="meta-item">
                                <strong>Качество:</strong> {moonData?.quality}
                              </div>
                              <div className="meta-item">
                                <strong>Планета-управитель:</strong> {moonData?.ruler}
                              </div>
                              <div className="meta-item">
                                <strong>Цвет силы:</strong> {moonData?.color}
                              </div>
                            </div>

                            <div className="sign-description-box moon-box">
                              <h5>🌙 Ваша Эмоциональная Природа:</h5>
                              <p className="full-interpretation" style={{whiteSpace: 'pre-line'}}>
                                {moonData?.moonInterpretation || (
                                  `Луна в ${astroData.astrologyProfile.moonSign.sign} определяет как вы чувствуете и реагируете эмоционально.
${moonData?.element === 'Огонь' ? 'Огненная Луна даёт вам страстные, импульсивные эмоции. Вы чувствуете ярко и интенсивно, реагируете быстро. Гнев вспыхивает мгновенно, но быстро проходит. Вам нужна активность и независимость для эмоционального здоровья.' : ''}${moonData?.element === 'Земля' ? 'Земная Луна даёт вам стабильные, практичные эмоции. Вы чувствуете через тело и материальный мир. Нуждаетесь в физической безопасности и комфорте. Эмоции обрабатываете медленно, но глубоко.' : ''}${moonData?.element === 'Воздух' ? 'Воздушная Луна даёт вам рациональные, подвижные эмоции. Вы анализируете чувства и нуждаетесь проговорить их. Общение и интеллектуальная стимуляция важны для эмоционального благополучия.' : ''}${moonData?.element === 'Вода' ? 'Водная Луна даёт вам глубокие, интуитивные эмоции. Вы чувствуете настроение других как своё. Эмпатия невероятно сильна. Нуждаетесь в эмоциональной близости и безопасности.' : ''}`
                                )}
                              </p>
                            </div>

                            <div className="moon-needs-box">
                              <h5>🌙 Эмоциональные Потребности:</h5>
                              <div className="keywords-grid">
                                {moonData?.keywords?.map((kw, idx) => (
                                  <span key={idx} className="keyword-tag moon">{kw}</span>
                                ))}
                              </div>
                              <p style={{marginTop: 12, fontSize: 13, color: '#666'}}>
                                Для внутреннего покоя вам нужно окружение, которое поддерживает эти качества.
                              </p>
                            </div>

                            {/* Emotional Expression */}
                            <div className="life-areas-section">
                              <div className="life-area-card moon-emotions">
                                <h5>💗 Как Вы Выражаете Эмоции</h5>
                                <p>
                                  {moonData?.element === 'Огонь' && 'Прямо и открыто. Ваши эмоции видны всем - вы не скрываете радость, гнев или страсть. Быстро вспыхиваете и быстро остываете.'}
                                  {moonData?.element === 'Земля' && 'Практически и стабильно. Вы не любите эмоциональные драмы. Показываете любовь через действия - заботу, подарки, создание комфорта.'}
                                  {moonData?.element === 'Воздух' && 'Через слова и логику. Вам нужно проговорить чувства чтобы их понять. Предпочитаете рациональное обсуждение эмоциональным всплескам.'}
                                  {moonData?.element === 'Вода' && 'Глубоко и интуитивно. Вы чувствуете больше чем говорите. Эмоции течёт как вода - иногда спокойно, иногда бурно.'}
                                </p>
                              </div>

                              <div className="life-area-card moon-comfort">
                                <h5>🏠 Что Даёт Вам Комфорт</h5>
                                <p>
                                  {moonData?.element === 'Огонь' && 'Активность, движение, вызовы. Вам скучно в покое - нужно действие и азарт. Спорт, приключения, новые проекты успокаивают вашу душу.'}
                                  {moonData?.element === 'Земля' && 'Стабильность, материальная безопасность, рутина. Вам нужна предсказуемость, качественные вещи, связь с природой и физический комфорт.'}
                                  {moonData?.element === 'Воздух' && 'Общение, информация, социальные связи. Вам нужны люди вокруг, интересные разговоры, книги и свобода передвижения.'}
                                  {moonData?.element === 'Вода' && 'Эмоциональная близость, тишина, время у воды. Вам нужна безопасная гавань где можно быть уязвимым и глубокая связь с близкими.'}
                                </p>
                              </div>
                            </div>

                            {/* Moon-specific traits */}
                            <div className="traits-grid">
                              <div className="trait-box positive moon-positive">
                                <h5>✨ Эмоциональные Дары:</h5>
                                <ul>
                                  {moonData?.fullInterpretation?.strengths?.slice(0, 3).map((trait, idx) => (
                                    <li key={idx}>{trait} (в чувствах)</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="trait-box negative moon-challenges">
                                <h5>⚡ Эмоциональные Вызовы:</h5>
                                <ul>
                                  {moonData?.fullInterpretation?.weaknesses?.slice(0, 3).map((trait, idx) => (
                                    <li key={idx}>{trait} (когда переживаете)</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="moon-advice">
                              <h5>💡 Как Работать с Вашей Луной:</h5>
                              <p>
                                Ваша Луна в {astroData.astrologyProfile.moonSign.sign} показывает что вам эмоционально нужно
                                {moonData?.element === 'Огонь' && ' активность и независимость. Не подавляйте свою страсть - выражайте эмоции здоровым образом через спорт или творчество.'}
                                {moonData?.element === 'Земля' && ' стабильность и практичность. Создавайте рутины которые дают безопасность. Заботьтесь о теле - массаж, еда, природа.'}
                                {moonData?.element === 'Воздух' && ' общение и понимание. Говорите о чувствах, пишите дневник. Социальная активность питает вашу душу.'}
                                {moonData?.element === 'Вода' && ' глубокая эмоциональная связь. Проводите время с близкими, у воды, в уединении. Медитация и творчество помогают.'}
                              </p>
                            </div>

                            {/* Moon in different life areas */}
                            <div className="moon-in-life">
                              <h5>🌙 Луна в Разных Сферах Жизни:</h5>
                              <div style={{display: 'grid', gap: 12, marginTop: 12}}>
                                <div className="moon-life-item">
                                  <strong>В детстве:</strong> Нуждались в {moonData?.element === 'Огонь' ? 'активности и свободе' : moonData?.element === 'Земля' ? 'стабильности и заботе' : moonData?.element === 'Воздух' ? 'общении и понимании' : 'эмоциональной близости и безопасности'}.
                                  {moonData?.element === 'Огонь' && ' Были энергичным ребёнком.'}
                                  {moonData?.element === 'Земля' && ' Ценили семейные традиции.'}
                                  {moonData?.element === 'Воздух' && ' Любили учиться и общаться.'}
                                  {moonData?.element === 'Вода' && ' Были чувствительным ребёнком.'}
                                </div>
                                <div className="moon-life-item">
                                  <strong>В отношениях:</strong> {moonData?.fullInterpretation?.love}
                                </div>
                                <div className="moon-life-item">
                                  <strong>В стрессе:</strong> Реагируете {moonData?.element === 'Огонь' ? 'импульсивно и агрессивно' : moonData?.element === 'Земля' ? 'замыканием и едой' : moonData?.element === 'Воздух' ? 'нервозностью и разговорами' : 'уходом в себя и слезами'}.
                                  Нужно {moonData?.element === 'Огонь' ? 'выплеснуть энергию через движение' : moonData?.element === 'Земля' ? 'заземлиться через рутину' : moonData?.element === 'Воздух' ? 'проговорить проблему' : 'побыть в одиночестве и покое'}.
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Rising Sign - Tertiary */}
              {astroData.astrologyProfile.risingSign && (
                <div className="interpretation-block expandable tertiary-sign">
                  <div className="block-header" onClick={() => toggleSection('rising')}>
                    <div className="header-content">
                      <div className="sign-hierarchy-badge tertiary">Внешний Образ</div>
                      <h4>⬆️ Восходящий в {astroData.astrologyProfile.risingSign.sign}</h4>
                    </div>
                    <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('rising'); }}>
                      {expandedSections.rising ? '▲ Свернуть' : '▼ Развернуть'}
                    </button>
                  </div>

                  <p className="short-desc">
                    <strong>Ваша маска:</strong> Как вас видят другие, ваше первое впечатление, внешность.
                  </p>

                  {expandedSections.rising && (
                    <div className="detailed-content">
                      {(() => {
                        const risingData = ZODIAC_DETAILED[astroData.astrologyProfile.risingSign.sign]
                        return (
                          <>
                            <div className="sign-meta-info">
                              <div className="meta-item">
                                <strong>Элемент:</strong> {risingData?.element}
                              </div>
                              <div className="meta-item">
                                <strong>Качество:</strong> {risingData?.quality}
                              </div>
                              <div className="meta-item">
                                <strong>Управитель:</strong> {risingData?.ruler}
                              </div>
                              <div className="meta-item">
                                <strong>Стиль:</strong> {risingData?.element === 'Огонь' ? 'Энергичный' : risingData?.element === 'Земля' ? 'Практичный' : risingData?.element === 'Воздух' ? 'Общительный' : 'Эмоциональный'}
                              </div>
                            </div>

                            <div className="sign-description-box rising-box">
                              <h5>⬆️ Ваша Внешняя Маска:</h5>
                              <p className="full-interpretation" style={{whiteSpace: 'pre-line'}}>
                                {risingData?.risingInterpretation || (
                                  `Восходящий знак в ${astroData.astrologyProfile.risingSign.sign} - это ваш "социальный костюм" и первое впечатление.
${risingData?.element === 'Огонь' ? 'Вы выглядите энергичным, уверенным, активным. Движения быстрые, походка решительная. Атлетическое телосложение. Люди видят в вас лидера и инициатора. В обществе берёте инициативу естественно. Стиль одежды спортивный, яркий.' : ''}${risingData?.element === 'Земля' ? 'Вы выглядите надёжным, практичным, спокойным. Движения размеренные, походка устойчивая. Крепкое телосложение. Люди видят в вас стабильность и основательность. В обществе создаёте атмосферу спокойствия. Стиль одежды классический, качественный.' : ''}${risingData?.element === 'Воздух' ? 'Вы выглядите умным, общительным, лёгким. Движения быстрые, мимика живая. Стройное телосложение. Люди видят в вас интересного собеседника и интеллектуала. Легко заводите разговоры. Стиль одежды современный, лёгкий.' : ''}${risingData?.element === 'Вода' ? 'Вы выглядите чувствительным, загадочным, эмпатичным. Движения плавные, взгляд глубокий. Мягкое телосложение. Люди видят в вас глубину и эмоциональность. В обществе осторожны, но притягиваете. Стиль одежды романтичный, мягкий.' : ''}`
                                )}
                              </p>
                            </div>

                            {/* First Impression */}
                            <div className="life-areas-section">
                              <div className="life-area-card rising-impression">
                                <h5>👁️ Первое Впечатление</h5>
                                <p>
                                  При первой встрече люди воспринимают вас как
                                  {risingData?.element === 'Огонь' && ' активного, смелого, прямолинейного. Вы излучаете энергию и уверенность. Часто кажетесь моложе своих лет. Спортивное телосложение.'}
                                  {risingData?.element === 'Земля' && ' надёжного, серьёзного, практичного. Вы производите впечатление основательности. Выглядите солидно. Классический стиль одежды.'}
                                  {risingData?.element === 'Воздух' && ' умного, дружелюбного, общительного. Вы легко заводите разговор. Выглядите молодо и подвижно. Современный стиль.'}
                                  {risingData?.element === 'Вода' && ' мягкого, таинственного, чувствительного. В ваших глазах глубина. Люди чувствуют вашу эмпатию. Романтичный стиль.'}
                                </p>
                              </div>

                              <div className="life-area-card rising-behavior">
                                <h5>🎭 Манера Поведения</h5>
                                <p>
                                  {risingData?.element === 'Огонь' && 'Вы действуете быстро и решительно в публичных ситуациях. Берёте инициативу. Не боитесь внимания. Прямые и честные в общении.'}
                                  {risingData?.element === 'Земля' && 'Вы ведёте себя спокойно и размеренно. Не спешите. Практичны в подходе к любой ситуации. Надёжны и основательны.'}
                                  {risingData?.element === 'Воздух' && 'Вы легко адаптируетесь к людям и ситуациям. Много говорите. Любознательны. Создаёте лёгкую, приятную атмосферу.'}
                                  {risingData?.element === 'Вода' && 'Вы осторожны при знакомстве. Сначала наблюдаете. Интуитивно чувствуете настроение. Мягки и дипломатичны.'}
                                </p>
                              </div>
                            </div>

                            {/* Appearance */}
                            <div className="rising-appearance-box">
                              <h5>👤 Физическая Внешность:</h5>
                              <div style={{fontSize: 13, color: '#666', lineHeight: 1.6}}>
                                <p><strong>Общие черты {astroData.astrologyProfile.risingSign.sign}:</strong></p>
                                <ul style={{marginTop: 8, paddingLeft: 20}}>
                                  {risingData?.element === 'Огонь' && (
                                    <>
                                      <li>Атлетическое или спортивное телосложение</li>
                                      <li>Энергичная походка, быстрые движения</li>
                                      <li>Яркие, выразительные черты лица</li>
                                      <li>Любите красный, яркие цвета</li>
                                    </>
                                  )}
                                  {risingData?.element === 'Земля' && (
                                    <>
                                      <li>Крепкое, устойчивое телосложение</li>
                                      <li>Размеренные, спокойные движения</li>
                                      <li>Правильные, симметричные черты</li>
                                      <li>Любите натуральные, земные тона</li>
                                    </>
                                  )}
                                  {risingData?.element === 'Воздух' && (
                                    <>
                                      <li>Стройное, подвижное телосложение</li>
                                      <li>Живая мимика, активная жестикуляция</li>
                                      <li>Умные, ясные глаза</li>
                                      <li>Любите лёгкие, воздушные ткани</li>
                                    </>
                                  )}
                                  {risingData?.element === 'Вода' && (
                                    <>
                                      <li>Мягкое, текучее телосложение</li>
                                      <li>Плавные, грациозные движения</li>
                                      <li>Выразительные, глубокие глаза</li>
                                      <li>Любите мягкие, романтичные цвета</li>
                                    </>
                                  )}
                                </ul>
                              </div>
                            </div>

                            {/* Life Stages */}
                            <div className="traits-grid">
                              <div className="trait-box rising-youth">
                                <h5>👶 В Молодости (0-30 лет):</h5>
                                <p style={{fontSize: 13}}>
                                  Восходящий знак особенно сильно проявлен. Вы ведёте себя как типичный {astroData.astrologyProfile.risingSign.sign}.
                                  Люди часто говорят "ты такой {astroData.astrologyProfile.risingSign.sign}!" хотя ваше Солнце в другом знаке.
                                </p>
                              </div>

                              <div className="trait-box rising-maturity">
                                <h5>🧘 После 30 лет:</h5>
                                <p style={{fontSize: 13}}>
                                  Постепенно всё больше проявляется ваш солнечный знак ({astroData.astrologyProfile.sunSign.sign}).
                                  Восходящий становится осознанным инструментом - вы выбираете когда его использовать.
                                </p>
                              </div>
                            </div>

                            <div className="rising-tip">
                              <h5>💫 Как Использовать Восходящий:</h5>
                              <p>
                                Ваш восходящий {astroData.astrologyProfile.risingSign.sign} - это ваш социальный инструмент.
                                Используйте его качества ({risingData?.keywords?.slice(0, 3).join(', ')}) в профессиональных ситуациях,
                                при знакомствах, в карьере. Это ваша сильная сторона в обществе!
                              </p>
                            </div>

                            {/* Career Impact */}
                            <div className="rising-career-box">
                              <h5>💼 Влияние на Карьеру:</h5>
                              <p style={{fontSize: 13, color: '#666', lineHeight: 1.6}}>
                                {risingData?.element === 'Огонь' && 'Вас часто выбирают на лидерские позиции. Вы производите впечатление компетентного руководителя. Подходят: продажи, менеджмент, спорт.'}
                                {risingData?.element === 'Земля' && 'Вас воспринимают как надёжного профессионала. Доверяют серьёзные задачи. Подходят: финансы, управление, строительство.'}
                                {risingData?.element === 'Воздух' && 'Вас ценят за коммуникативность и ум. Отлично в командах. Подходят: PR, продажи, обучение, консалтинг.'}
                                {risingData?.element === 'Вода' && 'Вас любят за эмпатию и понимание. Умеете работать с людьми. Подходят: психология, медицина, искусство, HR.'}
                              </p>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Mercury - 4th Point */}
              {astroData.astrologyProfile.planets?.Mercury && (() => {
                const sign = astroData.astrologyProfile.planets.Mercury.sign;
                const mercuryData = MERCURY_IN_SIGNS[sign];
                return mercuryData && (
                  <div className="interpretation-block expandable fourth-point">
                    <div className="block-header" onClick={() => toggleSection('mercury-key')}>
                      <div className="header-content">
                        <div className="sign-hierarchy-badge fourth">Ваш Ум</div>
                        <h4>☿ Меркурий в {sign} - {mercuryData.quickSummary}</h4>
                      </div>
                      <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('mercury-key'); }}>
                        {expandedSections['mercury-key'] ? '▲ Свернуть' : '▼ Развернуть'}
                      </button>
                    </div>
                    <p className="short-desc">
                      <strong>Как вы думаете и общаетесь:</strong> {mercuryData.description}
                    </p>
                    {expandedSections['mercury-key'] && (
                      <div className="detailed-content">
                        <div className="sign-description-box mercury-box">
                          <h5>☿ Ваш Стиль Мышления и Коммуникации:</h5>
                          <div className="full-interpretation" style={{whiteSpace: 'pre-line'}}>
                            {mercuryData.description}
                          </div>
                        </div>
                        <div className="traits-grid">
                          <div className="trait-box positive">
                            <h5>✨ Сильные Стороны:</h5>
                            <ul>
                              {mercuryData.communicationStyle.strengths.slice(0, 3).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="trait-box negative">
                            <h5>⚡ Вызовы:</h5>
                            <ul>
                              {mercuryData.communicationStyle.challenges.slice(0, 3).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Venus - 5th Point */}
              {astroData.astrologyProfile.planets?.Venus && (() => {
                const sign = astroData.astrologyProfile.planets.Venus.sign;
                const venusData = VENUS_IN_SIGNS[sign];
                return venusData && (
                  <div className="interpretation-block expandable fifth-point">
                    <div className="block-header" onClick={() => toggleSection('venus-key')}>
                      <div className="header-content">
                        <div className="sign-hierarchy-badge fifth">Ваша Любовь</div>
                        <h4>♀ Венера в {sign} - {venusData.quickSummary}</h4>
                      </div>
                      <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('venus-key'); }}>
                        {expandedSections['venus-key'] ? '▲ Свернуть' : '▼ Развернуть'}
                      </button>
                    </div>
                    <p className="short-desc">
                      <strong>Как вы любите и цените:</strong> {venusData.description}
                    </p>
                    {expandedSections['venus-key'] && (
                      <div className="detailed-content">
                        <div className="sign-description-box venus-box">
                          <h5>♀ Ваш Стиль Любви и Ценностей:</h5>
                          <div className="full-interpretation" style={{whiteSpace: 'pre-line'}}>
                            {venusData.description}
                          </div>
                        </div>
                        <div className="traits-grid">
                          <div className="trait-box positive">
                            <h5>💕 В Отношениях:</h5>
                            <ul>
                              {venusData.relationships.positives.slice(0, 3).map((p, i) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="trait-box negative">
                            <h5>⚡ Вызовы:</h5>
                            <ul>
                              {venusData.relationships.challenges.slice(0, 3).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Mars - 6th Point */}
              {astroData.astrologyProfile.planets?.Mars && (() => {
                const sign = astroData.astrologyProfile.planets.Mars.sign;
                const marsData = MARS_IN_SIGNS[sign];
                return marsData && (
                  <div className="interpretation-block expandable sixth-point">
                    <div className="block-header" onClick={() => toggleSection('mars-key')}>
                      <div className="header-content">
                        <div className="sign-hierarchy-badge sixth">Ваши Действия</div>
                        <h4>♂ Марс в {sign} - {marsData.quickSummary}</h4>
                      </div>
                      <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('mars-key'); }}>
                        {expandedSections['mars-key'] ? '▲ Свернуть' : '▼ Развернуть'}
                      </button>
                    </div>
                    <p className="short-desc">
                      <strong>Как вы действуете и боретесь:</strong> {marsData.description}
                    </p>
                    {expandedSections['mars-key'] && (
                      <div className="detailed-content">
                        <div className="sign-description-box mars-box">
                          <h5>♂ Ваш Стиль Действий и Энергия:</h5>
                          <div className="full-interpretation" style={{whiteSpace: 'pre-line'}}>
                            <p><strong>Подход:</strong> {marsData.actionStyle.approach}</p>
                            <p><strong>Энергия:</strong> {marsData.actionStyle.energy}</p>
                            <p><strong>Мотивация:</strong> {marsData.actionStyle.motivation}</p>
                            <p><strong>Выражение:</strong> {marsData.actionStyle.expression}</p>
                          </div>
                        </div>

                        <div className="traits-grid">
                          <div className="trait-box positive">
                            <h5>💪 Сильные Стороны в Действии:</h5>
                            <ul>
                              {marsData.drive.strengths.slice(0, 5).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="trait-box negative">
                            <h5>⚡ Вызовы:</h5>
                            <ul>
                              {marsData.drive.challenges.slice(0, 5).map((c, i) => (
                                <li key={i}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mars-conflict-box">
                          <h5>⚔️ В Конфликте:</h5>
                          <p>{marsData.drive.conflict}</p>
                        </div>

                        <div className="mars-careers-box">
                          <h5>💼 Карьеры где ваш Марс Сияет:</h5>
                          <div className="keywords-grid">
                            {marsData.careers.map((career, idx) => (
                              <span key={idx} className="keyword-tag mars">{career}</span>
                            ))}
                          </div>
                        </div>

                        <div className="planet-advice">
                          <h5>💡 Совет:</h5>
                          <p>{marsData.advice}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Jupiter - 7th Point */}
              {astroData.astrologyProfile.planets?.Jupiter && (() => {
                const sign = astroData.astrologyProfile.planets.Jupiter.sign;
                const jupiterData = JUPITER_IN_SIGNS[sign];
                return jupiterData && (
                  <div className="interpretation-block expandable seventh-point">
                    <div className="block-header" onClick={() => toggleSection('jupiter-key')}>
                      <div className="header-content">
                        <div className="sign-hierarchy-badge seventh">Ваша Удача</div>
                        <h4>♃ Юпитер в {sign} - {jupiterData.quickSummary}</h4>
                      </div>
                      <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('jupiter-key'); }}>
                        {expandedSections['jupiter-key'] ? '▲ Свернуть' : '▼ Развернуть'}
                      </button>
                    </div>
                    <p className="short-desc">
                      <strong>Где и как вы растёте:</strong> {jupiterData.description}
                    </p>
                    {expandedSections['jupiter-key'] && (
                      <div className="detailed-content">
                        <div className="sign-description-box jupiter-box">
                          <h5>♃ Ваша Удача и Рост:</h5>
                          <div className="full-interpretation" style={{whiteSpace: 'pre-line'}}>
                            <p><strong>Где удача:</strong> {jupiterData.luckAreas.where}</p>
                            <p><strong>Как привлечь:</strong> {jupiterData.luckAreas.how}</p>
                            <p><strong>Когда:</strong> {jupiterData.luckAreas.timing}</p>
                          </div>
                        </div>

                        <div className="jupiter-growth-box">
                          <h5>🌱 Путь Роста:</h5>
                          <p><strong>Как вы растёте:</strong> {jupiterData.growth.path}</p>
                          <p><strong>Ваша философия:</strong> {jupiterData.growth.philosophy}</p>
                          <p><strong>Оптимизм:</strong> {jupiterData.growth.optimism}</p>
                          <p><strong>Расширение через:</strong> {jupiterData.growth.expansion}</p>
                        </div>

                        <div className="jupiter-opportunities-box">
                          <h5>🎯 Области Возможностей:</h5>
                          <div className="keywords-grid">
                            {jupiterData.opportunities.map((opp, idx) => (
                              <span key={idx} className="keyword-tag jupiter">{opp}</span>
                            ))}
                          </div>
                        </div>

                        <div className="jupiter-challenges-box">
                          <h5>⚠️ Важно Избегать:</h5>
                          <p>{jupiterData.challenges}</p>
                        </div>

                        <div className="planet-advice">
                          <h5>💡 Совет:</h5>
                          <p>{jupiterData.advice}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Saturn - 8th Point */}
              {astroData.astrologyProfile.planets?.Saturn && (() => {
                const sign = astroData.astrologyProfile.planets.Saturn.sign;
                const saturnData = SATURN_IN_SIGNS[sign];
                return saturnData && (
                  <div className="interpretation-block expandable eighth-point">
                    <div className="block-header" onClick={() => toggleSection('saturn-key')}>
                      <div className="header-content">
                        <div className="sign-hierarchy-badge eighth">Ваши Уроки</div>
                        <h4>♄ Сатурн в {sign} - {saturnData.quickSummary}</h4>
                      </div>
                      <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('saturn-key'); }}>
                        {expandedSections['saturn-key'] ? '▲ Свернуть' : '▼ Развернуть'}
                      </button>
                    </div>
                    <p className="short-desc">
                      <strong>Ваши жизненные уроки:</strong> {saturnData.description}
                    </p>
                    {expandedSections['saturn-key'] && (
                      <div className="detailed-content">
                        <div className="sign-description-box saturn-box">
                          <h5>♄ Ваш Жизненный Урок:</h5>
                          <div className="full-interpretation" style={{whiteSpace: 'pre-line'}}>
                            <p><strong>Главный урок:</strong> {saturnData.lessons.primary}</p>
                            <p><strong>Вызов:</strong> {saturnData.lessons.challenge}</p>
                            <p><strong>Рост через:</strong> {saturnData.lessons.growth}</p>
                            <p><strong>Мастерство:</strong> {saturnData.lessons.mastery}</p>
                          </div>
                        </div>

                        <div className="saturn-karmic-box">
                          <h5>🔄 Кармические Темы:</h5>
                          <p><strong>Прошлое:</strong> {saturnData.karmic.pastLife}</p>
                          <p><strong>В этой жизни:</strong> {saturnData.karmic.thisLife}</p>
                          <p><strong>Основной страх:</strong> {saturnData.karmic.fear}</p>
                          <p><strong>Работа:</strong> {saturnData.karmic.work}</p>
                        </div>

                        <div className="saturn-timeline-box">
                          <h5>⏳ Эволюция во Времени:</h5>
                          <p><strong>Раннее детство:</strong> {saturnData.earlyLife}</p>
                          <p><strong>Зрелость (после 30):</strong> {saturnData.maturity}</p>
                        </div>

                        <div className="saturn-careers-box">
                          <h5>💼 Карьеры для Мастерства:</h5>
                          <p>{saturnData.careers}</p>
                        </div>

                        <div className="planet-advice">
                          <h5>💡 Совет:</h5>
                          <p>{saturnData.advice}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Uranus - 9th Point */}
              {astroData.astrologyProfile.planets?.Uranus && (() => {
                const sign = astroData.astrologyProfile.planets.Uranus.sign;
                const uranusData = URANUS_IN_SIGNS[sign];
                return uranusData && (
                  <div className="interpretation-block expandable ninth-point">
                    <div className="block-header" onClick={() => toggleSection('uranus-key')}>
                      <div className="header-content">
                        <div className="sign-hierarchy-badge ninth">Ваша Уникальность</div>
                        <h4>♅ Уран в {sign} - {uranusData.quickSummary}</h4>
                      </div>
                      <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('uranus-key'); }}>
                        {expandedSections['uranus-key'] ? '▲ Свернуть' : '▼ Развернуть'}
                      </button>
                    </div>
                    <p className="short-desc">
                      <strong>Как вы бунтуете и инновируете:</strong> {uranusData.description}
                    </p>
                    {expandedSections['uranus-key'] && (
                      <div className="detailed-content">
                        <div className="sign-description-box uranus-box">
                          <h5>♅ Ваша Революция:</h5>
                          <p className="full-interpretation">{uranusData.description}</p>
                        </div>

                        <div className="uranus-generation-box">
                          <h5>👥 Поколенческая Миссия:</h5>
                          <p><strong>Эпоха:</strong> {uranusData.generational?.era || 'Ваше поколение'}</p>
                          <p><strong>Коллективная задача:</strong> {uranusData.generational?.theme || uranusData.description}</p>
                        </div>

                        <div className="planet-advice">
                          <h5>💡 Совет:</h5>
                          <p>{uranusData.advice}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Neptune - 10th Point */}
              {astroData.astrologyProfile.planets?.Neptune && (() => {
                const sign = astroData.astrologyProfile.planets.Neptune.sign;
                const neptuneData = NEPTUNE_IN_SIGNS[sign];
                return neptuneData && (
                  <div className="interpretation-block expandable tenth-point">
                    <div className="block-header" onClick={() => toggleSection('neptune-key')}>
                      <div className="header-content">
                        <div className="sign-hierarchy-badge tenth">Ваши Мечты</div>
                        <h4>♆ Нептун в {sign} - {neptuneData.quickSummary}</h4>
                      </div>
                      <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('neptune-key'); }}>
                        {expandedSections['neptune-key'] ? '▲ Свернуть' : '▼ Развернуть'}
                      </button>
                    </div>
                    <p className="short-desc">
                      <strong>Ваши мечты и духовность:</strong> {neptuneData.description}
                    </p>
                    {expandedSections['neptune-key'] && (
                      <div className="detailed-content">
                        <div className="sign-description-box neptune-box">
                          <h5>♆ Ваша Духовная Природа:</h5>
                          <p className="full-interpretation">{neptuneData.description}</p>
                        </div>

                        <div className="neptune-generation-box">
                          <h5>🌊 Поколенческие Мечты:</h5>
                          <p><strong>Эпоха:</strong> {neptuneData.generational?.era || 'Ваше поколение'}</p>
                          <p><strong>Коллективные идеалы:</strong> {neptuneData.generational?.theme || neptuneData.description}</p>
                        </div>

                        <div className="planet-advice">
                          <h5>💡 Совет:</h5>
                          <p>{neptuneData.advice}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Pluto - 11th Point */}
              {astroData.astrologyProfile.planets?.Pluto && (() => {
                const sign = astroData.astrologyProfile.planets.Pluto.sign;
                const plutoData = PLUTO_IN_SIGNS[sign];
                return plutoData && (
                  <div className="interpretation-block expandable eleventh-point">
                    <div className="block-header" onClick={() => toggleSection('pluto-key')}>
                      <div className="header-content">
                        <div className="sign-hierarchy-badge eleventh">Ваша Трансформация</div>
                        <h4>♇ Плутон в {sign} - {plutoData.quickSummary}</h4>
                      </div>
                      <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('pluto-key'); }}>
                        {expandedSections['pluto-key'] ? '▲ Свернуть' : '▼ Развернуть'}
                      </button>
                    </div>
                    <p className="short-desc">
                      <strong>Ваша сила и трансформация:</strong> {plutoData.description}
                    </p>
                    {expandedSections['pluto-key'] && (
                      <div className="detailed-content">
                        <div className="sign-description-box pluto-box">
                          <h5>♇ Ваша Глубинная Сила:</h5>
                          <p className="full-interpretation">{plutoData.description}</p>
                        </div>

                        <div className="pluto-generation-box">
                          <h5>💀 Поколенческая Трансформация:</h5>
                          <p><strong>Эпоха:</strong> {plutoData.generational?.era || 'Ваше поколение'}</p>
                          <p><strong>Что разрушаем и создаём:</strong> {plutoData.generational?.theme || plutoData.description}</p>
                        </div>

                        <div className="planet-advice">
                          <h5>💡 Совет:</h5>
                          <p>{plutoData.advice}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Element Balance - 12th Point */}
              {astroData.astrologyProfile.elementBalance && (
                <div className="interpretation-block expandable element-balance-point">
                  <div className="block-header" onClick={() => toggleSection('element-balance')}>
                    <div className="header-content">
                      <div className="sign-hierarchy-badge balance">Ваш Темперамент</div>
                      <h4>🔥💧🌍💨 Баланс Элементов - Ваша Природа</h4>
                    </div>
                    <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('element-balance'); }}>
                      {expandedSections['element-balance'] ? '▲ Свернуть' : '▼ Развернуть'}
                    </button>
                  </div>
                  <p className="short-desc">
                    <strong>Ваш темперамент:</strong> Распределение четырёх элементов показывает вашу базовую природу
                  </p>
                  {expandedSections['element-balance'] && (
                    <div className="detailed-content">
                      <div className="element-grid">
                        {Object.entries(astroData.astrologyProfile.elementBalance).map(([element, data]) => (
                          <div key={element} className={`element-card element-${element.toLowerCase()}`}>
                            <div className="element-icon">
                              {element === 'Огонь' && '🔥'}
                              {element === 'Земля' && '🌍'}
                              {element === 'Воздух' && '💨'}
                              {element === 'Вода' && '💧'}
                            </div>
                            <h5>{element}</h5>
                            <div className="element-count">
                              <span className="count-number">{data.count}</span>
                              <span className="count-label">планет</span>
                            </div>
                            <div className="element-percentage">
                              {Math.round((data.count / 11) * 100)}%
                            </div>
                            <div className="element-bar">
                              <div
                                className="element-fill"
                                style={{width: `${(data.count / 11) * 100}%`}}
                              ></div>
                            </div>
                            <p className="element-meaning">{data.meaning}</p>
                          </div>
                        ))}
                      </div>

                      <div className="element-interpretation-box">
                        <h5>🎨 Что Это Значит:</h5>
                        <div className="dominant-element">
                          <p><strong>Доминирующий элемент:</strong> {
                            Object.entries(astroData.astrologyProfile.elementBalance)
                              .sort((a, b) => b[1].count - a[1].count)[0][0]
                          }</p>
                          <p style={{fontSize: '14px', marginTop: '8px', color: '#666'}}>
                            {(() => {
                              const dominant = Object.entries(astroData.astrologyProfile.elementBalance)
                                .sort((a, b) => b[1].count - a[1].count)[0][0];

                              if (dominant === 'Огонь') return 'Вы энергичны, страстны, инициативны. Действуете быстро и решительно. Лидер по натуре.';
                              if (dominant === 'Земля') return 'Вы практичны, стабильны, надёжны. Цените материальное и конкретные результаты. Строитель.';
                              if (dominant === 'Воздух') return 'Вы интеллектуальны, общительны, любопытны. Живёте идеями и коммуникацией. Мыслитель.';
                              if (dominant === 'Вода') return 'Вы эмоциональны, интуитивны, эмпатичны. Чувствуете глубоко. Целитель душ.';
                            })()}
                          </p>
                        </div>

                        <div className="balance-analysis">
                          <h5>⚖️ Баланс:</h5>
                          {(() => {
                            const counts = Object.values(astroData.astrologyProfile.elementBalance).map(e => e.count);
                            const max = Math.max(...counts);
                            const min = Math.min(...counts);
                            const diff = max - min;

                            if (diff <= 2) {
                              return <p>✅ <strong>Гармоничный баланс</strong> - все элементы представлены равномерно. Вы универсальны и адаптивны.</p>;
                            } else if (diff <= 4) {
                              return <p>⚖️ <strong>Умеренный перекос</strong> - есть предпочтения, но гибкость сохранена.</p>;
                            } else {
                              return <p>⚡ <strong>Сильный акцент</strong> - яркая специализация в одном элементе. Мощь, но нужна работа над балансом.</p>;
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Strengths - 13th Point */}
              {astroData.astrologyProfile.strengths && astroData.astrologyProfile.strengths.length > 0 && (
                <div className="interpretation-block expandable strengths-point">
                  <div className="block-header" onClick={() => toggleSection('strengths')}>
                    <div className="header-content">
                      <div className="sign-hierarchy-badge strength">Ваши Дары</div>
                      <h4>✨ Сильные Стороны - Ваши Суперсилы</h4>
                    </div>
                    <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('strengths'); }}>
                      {expandedSections['strengths'] ? '▲ Свернуть' : '▼ Развернуть'}
                    </button>
                  </div>
                  <p className="short-desc">
                    <strong>Ваши природные таланты:</strong> На что опираться и что развивать
                  </p>
                  {expandedSections['strengths'] && (
                    <div className="detailed-content">
                      <div className="strengths-grid">
                        {astroData.astrologyProfile.strengths.map((strength, idx) => (
                          <div key={idx} className="strength-card">
                            <div className="strength-icon">💎</div>
                            <p>{strength}</p>
                          </div>
                        ))}
                      </div>
                      <div className="strengths-advice-box">
                        <h5>💡 Как Использовать:</h5>
                        <p>Эти качества - ваши естественные дары. Развивайте их, опирайтесь на них в трудные моменты. Именно через них вы наиболее эффективны и счастливы.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Challenges - 14th Point */}
              {astroData.astrologyProfile.challenges && astroData.astrologyProfile.challenges.length > 0 && (
                <div className="interpretation-block expandable challenges-point">
                  <div className="block-header" onClick={() => toggleSection('challenges')}>
                    <div className="header-content">
                      <div className="sign-hierarchy-badge challenge">Ваши Уроки</div>
                      <h4>⚡ Вызовы - Области Роста</h4>
                    </div>
                    <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('challenges'); }}>
                      {expandedSections['challenges'] ? '▲ Свернуть' : '▼ Развернуть'}
                    </button>
                  </div>
                  <p className="short-desc">
                    <strong>Области развития:</strong> Не слабости, а точки роста и трансформации
                  </p>
                  {expandedSections['challenges'] && (
                    <div className="detailed-content">
                      <div className="challenges-grid">
                        {astroData.astrologyProfile.challenges.map((challenge, idx) => (
                          <div key={idx} className="challenge-card">
                            <div className="challenge-icon">🎯</div>
                            <p>{challenge}</p>
                          </div>
                        ))}
                      </div>
                      <div className="challenges-wisdom-box">
                        <h5>🌟 Мудрость Вызовов:</h5>
                        <p><em>"Препятствия - не наказание, а приглашение стать сильнее."</em></p>
                        <p style={{marginTop: '12px'}}>
                          Эти области показывают не слабости, а точки максимального потенциала роста.
                          Работая над ними, вы раскрываете скрытые таланты и становитесь целостной личностью.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Life Lesson - 15th Point */}
              {astroData.astrologyProfile.lifeLesson && (
                <div className="interpretation-block expandable life-lesson-point">
                  <div className="block-header" onClick={() => toggleSection('life-lesson')}>
                    <div className="header-content">
                      <div className="sign-hierarchy-badge lesson">Ваш Путь</div>
                      <h4>📿 Жизненный Урок - Что Вы Здесь Изучаете</h4>
                    </div>
                    <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('life-lesson'); }}>
                      {expandedSections['life-lesson'] ? '▲ Свернуть' : '▼ Развернуть'}
                    </button>
                  </div>
                  <p className="short-desc">
                    <strong>Ваш главный урок:</strong> Центральная тема вашего жизненного пути
                  </p>
                  {expandedSections['life-lesson'] && (
                    <div className="detailed-content">
                      <div className="life-lesson-box">
                        <h5>📖 Урок Вашей Души:</h5>
                        <p className="life-lesson-text">{astroData.astrologyProfile.lifeLesson}</p>
                      </div>
                      <div className="lesson-guidance-box">
                        <h5>🧭 Как Работать с Этим Уроком:</h5>
                        <p>Жизненный урок - это не то, что нужно "пройти" один раз. Это центральная тема, которая будет повторяться в разных формах на протяжении всей жизни. Каждый раз, встречая её, вы поднимаетесь на новый уровень мастерства.</p>
                        <ul style={{marginTop: '12px', paddingLeft: '20px'}}>
                          <li>Признайте, что эта тема важна для вашего развития</li>
                          <li>Наблюдайте, как она проявляется в разных областях жизни</li>
                          <li>Будьте терпеливы - мастерство приходит со временем</li>
                          <li>Делитесь своим опытом - обучая других, вы углубляете свое понимание</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Soul Purpose - 16th Point */}
              {astroData.astrologyProfile.soulPurpose && (
                <div className="interpretation-block expandable soul-purpose-point">
                  <div className="block-header" onClick={() => toggleSection('soul-purpose')}>
                    <div className="header-content">
                      <div className="sign-hierarchy-badge purpose">Ваше Предназначение</div>
                      <h4>🌟 Предназначение Души - Зачем Вы Здесь</h4>
                    </div>
                    <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('soul-purpose'); }}>
                      {expandedSections['soul-purpose'] ? '▲ Свернуть' : '▼ Развернуть'}
                    </button>
                  </div>
                  <p className="short-desc">
                    <strong>Ваша миссия:</strong> Для чего ваша душа пришла в этот мир
                  </p>
                  {expandedSections['soul-purpose'] && (
                    <div className="detailed-content">
                      <div className="soul-purpose-box">
                        <h5>✨ Миссия Вашей Души:</h5>
                        <p className="soul-purpose-text">{astroData.astrologyProfile.soulPurpose}</p>
                      </div>
                      <div className="purpose-activation-box">
                        <h5>🔥 Как Активировать Свое Предназначение:</h5>
                        <p>Предназначение не ограничивает вас одной профессией или ролью. Это ЭНЕРГИЯ, которую вы приносите в мир через всё, что делаете.</p>
                        <div style={{marginTop: '16px', background: '#f5f5f5', padding: '16px', borderRadius: '8px'}}>
                          <p><strong>Признаки, что вы в своём предназначении:</strong></p>
                          <ul style={{marginTop: '8px', paddingLeft: '20px'}}>
                            <li>Чувствуете внутреннюю правильность и поток</li>
                            <li>Время летит незаметно</li>
                            <li>Люди естественно получают пользу от вашего присутствия</li>
                            <li>Трудности воспринимаются как вызовы, а не препятствия</li>
                            <li>Есть ощущение смысла, даже в мелочах</li>
                          </ul>
                        </div>
                        <p style={{marginTop: '16px', fontStyle: 'italic', color: '#666'}}>
                          Помните: путь к предназначению - это путешествие, а не пункт назначения. Каждый шаг в этом направлении уже наполняет жизнь смыслом.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Natal Chart Wheel Visualization */}
            <div className="chart-visualization-section" id="wheel">
              <h3>🔮 Круг Натальной Карты</h3>
              <p className="section-intro" style={{textAlign: 'center', maxWidth: 700, margin: '0 auto 24px'}}>
                Это визуальная карта неба в момент вашего рождения - снимок планетных позиций который определяет вашу жизнь
              </p>

              {/* Info boxes before wheel */}
              <div className="wheel-info-grid">
                <div className="wheel-info-box">
                  <h4>📍 Ваша Космическая Координата</h4>
                  <p className="info-explainer">Уникальная точка пространства-времени вашего рождения</p>
                  <p>
                    <strong>Место:</strong> {astroData.birthInfo?.birthCity || 'Не указано'}<br/>
                    <strong>Дата:</strong> {astroData.birthInfo?.birthDate ? new Date(astroData.birthInfo.birthDate).toLocaleDateString('ru-RU') : 'Не указано'}<br/>
                    <strong>Время:</strong> {astroData.birthInfo?.birthTime || 'Не указано'}
                  </p>
                </div>

                <div className="wheel-info-box big-three">
                  <h4>⭐ Ваша Большая Тройка</h4>
                  <p className="info-explainer">Три самых важных точки вашей личности</p>
                  <div className="big-three-items">
                    <div className="big-three-item">
                      <span className="bt-label">☀️ Солнце (кто вы):</span>
                      <span className="bt-value">{astroData.astrologyProfile?.sunSign?.sign || '?'}</span>
                    </div>
                    <div className="big-three-item">
                      <span className="bt-label">🌙 Луна (как чувствуете):</span>
                      <span className="bt-value">{astroData.astrologyProfile?.moonSign?.sign || '?'}</span>
                    </div>
                    <div className="big-three-item">
                      <span className="bt-label">⬆️ Восходящий (как выглядите):</span>
                      <span className="bt-value">{astroData.astrologyProfile?.risingSign?.sign || '?'}</span>
                    </div>
                  </div>
                </div>

                <div className="wheel-info-box dominants-box">
                  <h4>🎯 Доминанты Карты</h4>
                  <p className="info-explainer">Что в вас доминирует и определяет ваш стиль</p>
                  <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12}}>
                    {/* Element */}
                    <div className="dominant-item">
                      <div className="dom-label">
                        <span>🔥💧🌪️🌍</span>
                        <span style={{marginLeft: 6}}>Ваш Элемент</span>
                      </div>
                      <div className="dom-value">
                        {(() => {
                          const elements = astroData.astrologyProfile?.elementBalance;

                          // If no elementBalance, calculate on the fly
                          if (!elements) {
                            // Fallback: calculate from Sun/Moon/Rising
                            const elementMap = {
                              'Овен': 'fire', 'Лев': 'fire', 'Стрелец': 'fire',
                              'Телец': 'earth', 'Дева': 'earth', 'Козерог': 'earth',
                              'Близнецы': 'air', 'Весы': 'air', 'Водолей': 'air',
                              'Рак': 'water', 'Скорпион': 'water', 'Рыбы': 'water'
                            };

                            const counts = { fire: 0, earth: 0, air: 0, water: 0 };

                            // Count from big three
                            const sunEl = elementMap[astroData.astrologyProfile?.sunSign?.sign];
                            const moonEl = elementMap[astroData.astrologyProfile?.moonSign?.sign];
                            const risingEl = elementMap[astroData.astrologyProfile?.risingSign?.sign];

                            if (sunEl) counts[sunEl] += 3;
                            if (moonEl) counts[moonEl] += 2;
                            if (risingEl) counts[risingEl] += 2;

                            // Find max
                            const maxEl = Object.entries(counts).reduce((a, b) => b[1] > a[1] ? b : a)[0];

                            const names = {
                              fire: '🔥 Огонь',
                              earth: '🌍 Земля',
                              air: '🌪️ Воздух',
                              water: '💧 Вода'
                            };

                            return (
                              <>
                                <strong>{names[maxEl] || 'Баланс'}</strong>
                                <span style={{fontSize: 10, color: '#999', marginLeft: 6}}>(из Big 3)</span>
                              </>
                            );
                          }

                          // Use calculated elementBalance - support both Russian and English keys
                          const elementData = [
                            { key: 'fire', name: '🔥 Огонь', percent: elements['Огонь']?.percentage || elements.fire?.percentage || 0 },
                            { key: 'earth', name: '🌍 Земля', percent: elements['Земля']?.percentage || elements.earth?.percentage || 0 },
                            { key: 'air', name: '🌪️ Воздух', percent: elements['Воздух']?.percentage || elements.air?.percentage || 0 },
                            { key: 'water', name: '💧 Вода', percent: elements['Вода']?.percentage || elements.water?.percentage || 0 }
                          ];

                          const max = elementData.reduce((a, b) => b.percent > a.percent ? b : a);

                          return (
                            <>
                              <strong>{max.name}</strong>
                              <span style={{fontSize: 11, color: '#999', marginLeft: 6}}>({max.percent}%)</span>
                            </>
                          );
                        })()}
                      </div>
                      <div className="dom-explain">Определяет ваш темперамент и подход к жизни</div>
                    </div>

                    {/* Planets */}
                    <div className="dominant-item">
                      <div className="dom-label">
                        <span>🪐</span>
                        <span style={{marginLeft: 6}}>Планеты в Карте</span>
                      </div>
                      <div className="dom-value">
                        <strong>{Object.keys(astroData.astrologyProfile?.planets || {}).length} из 10</strong>
                        <span style={{fontSize: 11, color: '#999', marginLeft: 6}}>активны</span>
                      </div>
                      <div className="dom-explain">Больше планет = более сложная личность</div>
                    </div>

                    {/* Aspects */}
                    <div className="dominant-item">
                      <div className="dom-label">
                        <span>⚹</span>
                        <span style={{marginLeft: 6}}>Аспекты (Углы Между Планетами)</span>
                      </div>
                      <div className="dom-value">
                        <strong>{astroData.astrologyProfile?.aspects?.length || 0}</strong>
                        <span style={{fontSize: 11, color: '#999', marginLeft: 6}}>
                          {(() => {
                            const harmonious = astroData.astrologyProfile?.aspects?.filter(a => a.nature === 'harmonious').length || 0;
                            const challenging = astroData.astrologyProfile?.aspects?.filter(a => a.nature === 'challenging').length || 0;
                            return `(${harmonious} ✓ | ${challenging} ⚠)`;
                          })()}
                        </span>
                      </div>
                      <div className="dom-explain">
                        Аспекты - это углы между планетами (например: Солнце ✓ Луна = гармония эго и эмоций).
                        ✓ = таланты и лёгкость | ⚠ = вызовы и развитие
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <NatalChartWheel astroData={astroData.astrologyProfile} />

              {/* Explanation after wheel */}
              <div className="wheel-explanation">
                <h4>💡 Как Читать Круг:</h4>
                <div className="explanation-grid">
                  <div className="explanation-item">
                    <span className="expl-icon">🔵</span>
                    <div>
                      <strong>Внешний круг</strong> - 12 знаков зодиака (символы)
                    </div>
                  </div>
                  <div className="explanation-item">
                    <span className="expl-icon">☀️</span>
                    <div>
                      <strong>Планеты</strong> - их позиции в знаках и домах
                    </div>
                  </div>
                  <div className="explanation-item">
                    <span className="expl-icon">📐</span>
                    <div>
                      <strong>Дома</strong> - 12 секторов жизненных сфер
                    </div>
                  </div>
                  <div className="explanation-item">
                    <span className="expl-icon">➡️</span>
                    <div>
                      <strong>ASC (красная линия)</strong> - ваш восходящий знак, стартовая точка
                    </div>
                  </div>
                </div>

                <div className="wheel-meaning-box">
                  <h5>🌟 Что Это Значит?</h5>
                  <p>
                    Ваша натальная карта - это уникальный космический отпечаток. Никто рождённый в другое время или месте не имеет такой же карты.
                    Это карта вашего потенциала, ваших даров, вызовов и судьбы.
                  </p>
                  <p>
                    Планеты - это "что" (энергии), знаки - это "как" (стиль), дома - это "где" (сферы жизни),
                    аспекты - это "почему" (как всё связано). Вместе они рассказывают историю вашей души.
                  </p>
                </div>

                <div className="wheel-fun-facts">
                  <h5>✨ Интересные Факты:</h5>
                  <ul>
                    <li>Ваша карта уникальна - шанс повторения ~1 к 25,000</li>
                    <li>Восходящий знак меняется каждые 2 часа - точное время рождения критично!</li>
                    <li>Луна проходит знак за 2.5 дня - эмоции очень персональны</li>
                    <li>Внешние планеты (Уран, Нептун, Плутон) определяют ваше поколение</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Planetary Positions - Enhanced with Detailed Interpretations */}
            {astroData.astrologyProfile.planets && (
              <div className="planets-section-enhanced" id="planets">
                <h3>🪐 Ваши Планеты - Детальная Интерпретация</h3>
                <p className="section-intro">Каждая планета в определённом знаке показывает как проявляется эта энергия в вашей жизни</p>

                {/* Mercury */}
                {astroData.astrologyProfile.planets.Mercury && (() => {
                  const sign = astroData.astrologyProfile.planets.Mercury.sign
                  const interpretation = MERCURY_IN_SIGNS[sign]
                  return interpretation && (
                    <div className="interpretation-block expandable planet-mercury">
                      <div className="block-header" onClick={() => toggleSection('mercury')}>
                        <div className="header-content">
                          <div className="planet-badge">☿ Меркурий</div>
                          <h4>☿ Меркурий в {sign} - {interpretation.quickSummary}</h4>
                        </div>
                        <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('mercury'); }}>
                          {expandedSections.mercury ? '▲ Свернуть' : '▼ Развернуть Детали'}
                        </button>
                      </div>
                      <p className="short-desc">{interpretation.description}</p>
                      {expandedSections.mercury && (
                        <div className="detailed-content">
                          <div className="planet-interpretation-grid">
                            <div className="interp-box communication">
                              <h5>💬 Стиль Общения</h5>
                              <p><strong>Подход:</strong> {interpretation.communicationStyle.style}</p>
                              <div className="traits-mini">
                                <div><strong>Сильные стороны:</strong> {interpretation.communicationStyle.strengths.join(', ')}</div>
                                <div><strong>Вызовы:</strong> {interpretation.communicationStyle.challenges.join(', ')}</div>
                              </div>
                            </div>
                            <div className="interp-box learning">
                              <h5>📚 Как Вы Учитесь</h5>
                              <p>{interpretation.learning}</p>
                            </div>
                            <div className="interp-box decision">
                              <h5>🎯 Принятие Решений</h5>
                              <p>{interpretation.decision}</p>
                            </div>
                            <div className="interp-box careers">
                              <h5>💼 Подходящие Карьеры</h5>
                              <div className="career-tags">
                                {interpretation.careers.map((career, idx) => (
                                  <span key={idx} className="career-tag">{career}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="planet-advice-box">
                            <h5>💡 Совет:</h5>
                            <p>{interpretation.advice}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Venus */}
                {astroData.astrologyProfile.planets.Venus && (() => {
                  const sign = astroData.astrologyProfile.planets.Venus.sign
                  const interpretation = VENUS_IN_SIGNS[sign]
                  return interpretation && (
                    <div className="interpretation-block expandable planet-venus">
                      <div className="block-header" onClick={() => toggleSection('venus')}>
                        <div className="header-content">
                          <div className="planet-badge">♀ Венера</div>
                          <h4>♀ Венера в {sign} - {interpretation.quickSummary}</h4>
                        </div>
                        <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('venus'); }}>
                          {expandedSections.venus ? '▲ Свернуть' : '▼ Развернуть Детали'}
                        </button>
                      </div>
                      <p className="short-desc">{interpretation.description}</p>
                      {expandedSections.venus && (
                        <div className="detailed-content">
                          <div className="planet-interpretation-grid">
                            <div className="interp-box love">
                              <h5>💕 Стиль Любви</h5>
                              <p><strong>Подход:</strong> {interpretation.loveStyle.approach}</p>
                              <p><strong>Привлекает:</strong> {interpretation.loveStyle.attractions}</p>
                              <p><strong>Выражение:</strong> {interpretation.loveStyle.expression}</p>
                              <p><strong>Потребности:</strong> {interpretation.loveStyle.needs}</p>
                            </div>
                            <div className="interp-box relationships">
                              <h5>💑 В Отношениях</h5>
                              <div className="traits-mini">
                                <div><strong>Плюсы:</strong> {interpretation.relationships.positives.join(', ')}</div>
                                <div><strong>Вызовы:</strong> {interpretation.relationships.challenges.join(', ')}</div>
                              </div>
                              <p style={{marginTop: 8}}><strong>Совместимость:</strong> {interpretation.relationships.compatibility}</p>
                            </div>
                            <div className="interp-box values">
                              <h5>💎 Ценности</h5>
                              <p>{interpretation.values}</p>
                            </div>
                            <div className="interp-box money">
                              <h5>💰 Отношение к Деньгам</h5>
                              <p>{interpretation.money}</p>
                            </div>
                            <div className="interp-box gifts">
                              <h5>🎁 Что Любите Получать</h5>
                              <p>{interpretation.gifts}</p>
                            </div>
                          </div>
                          <div className="planet-advice-box">
                            <h5>💡 Совет:</h5>
                            <p>{interpretation.advice}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Mars */}
                {astroData.astrologyProfile.planets.Mars && (() => {
                  const sign = astroData.astrologyProfile.planets.Mars.sign
                  const interpretation = MARS_IN_SIGNS[sign]
                  return interpretation && (
                    <div className="interpretation-block expandable planet-mars">
                      <div className="block-header" onClick={() => toggleSection('mars')}>
                        <div className="header-content">
                          <div className="planet-badge">♂ Марс</div>
                          <h4>♂ Марс в {sign} - {interpretation.quickSummary}</h4>
                        </div>
                        <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('mars'); }}>
                          {expandedSections.mars ? '▲ Свернуть' : '▼ Развернуть Детали'}
                        </button>
                      </div>
                      <p className="short-desc">{interpretation.description}</p>
                      {expandedSections.mars && (
                        <div className="detailed-content">
                          <div className="planet-interpretation-grid">
                            <div className="interp-box action">
                              <h5>⚡ Стиль Действий</h5>
                              <p><strong>Подход:</strong> {interpretation.actionStyle.approach}</p>
                              <p><strong>Энергия:</strong> {interpretation.actionStyle.energy}</p>
                              <p><strong>Мотивация:</strong> {interpretation.actionStyle.motivation}</p>
                            </div>
                            <div className="interp-box drive">
                              <h5>🔥 Драйв и Конфликт</h5>
                              <div className="traits-mini">
                                <div><strong>Сильные стороны:</strong> {interpretation.drive.strengths.join(', ')}</div>
                                <div><strong>Вызовы:</strong> {interpretation.drive.challenges.join(', ')}</div>
                              </div>
                              <p style={{marginTop: 8}}><strong>В конфликте:</strong> {interpretation.drive.conflict}</p>
                            </div>
                            <div className="interp-box sexuality">
                              <h5>🔥 Сексуальность</h5>
                              <p>{interpretation.sexuality}</p>
                            </div>
                            <div className="interp-box careers">
                              <h5>💼 Подходящие Карьеры</h5>
                              <div className="career-tags">
                                {interpretation.careers.map((career, idx) => (
                                  <span key={idx} className="career-tag">{career}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="planet-advice-box">
                            <h5>💡 Совет:</h5>
                            <p>{interpretation.advice}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Jupiter */}
                {astroData.astrologyProfile.planets.Jupiter && (() => {
                  const sign = astroData.astrologyProfile.planets.Jupiter.sign
                  const interpretation = JUPITER_IN_SIGNS[sign]
                  return interpretation && (
                    <div className="interpretation-block expandable planet-jupiter">
                      <div className="block-header" onClick={() => toggleSection('jupiter')}>
                        <div className="header-content">
                          <div className="planet-badge">♃ Юпитер</div>
                          <h4>♃ Юпитер в {sign} - {interpretation.quickSummary}</h4>
                        </div>
                        <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('jupiter'); }}>
                          {expandedSections.jupiter ? '▲ Свернуть' : '▼ Развернуть Детали'}
                        </button>
                      </div>
                      <p className="short-desc">{interpretation.description}</p>
                      {expandedSections.jupiter && (
                        <div className="detailed-content">
                          <div className="planet-interpretation-grid">
                            <div className="interp-box luck">
                              <h5>🍀 Области Удачи</h5>
                              <p><strong>Где:</strong> {interpretation.luckAreas.where}</p>
                              <p><strong>Как:</strong> {interpretation.luckAreas.how}</p>
                              <p><strong>Когда:</strong> {interpretation.luckAreas.timing}</p>
                            </div>
                            <div className="interp-box growth">
                              <h5>🌱 Путь Роста</h5>
                              <p>{interpretation.growth.path}</p>
                              <p><strong>Философия:</strong> {interpretation.growth.philosophy}</p>
                              <p><strong>Оптимизм:</strong> {interpretation.growth.optimism}</p>
                            </div>
                            <div className="interp-box opportunities">
                              <h5>🎯 Возможности</h5>
                              <div className="career-tags">
                                {interpretation.opportunities.map((opp, idx) => (
                                  <span key={idx} className="career-tag">{opp}</span>
                                ))}
                              </div>
                            </div>
                            <div className="interp-box challenges">
                              <h5>⚠️ Что Избегать</h5>
                              <p>{interpretation.challenges}</p>
                            </div>
                          </div>
                          <div className="planet-advice-box">
                            <h5>💡 Совет:</h5>
                            <p>{interpretation.advice}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Saturn */}
                {astroData.astrologyProfile.planets.Saturn && (() => {
                  const sign = astroData.astrologyProfile.planets.Saturn.sign
                  const interpretation = SATURN_IN_SIGNS[sign]
                  return interpretation && (
                    <div className="interpretation-block expandable planet-saturn">
                      <div className="block-header" onClick={() => toggleSection('saturn')}>
                        <div className="header-content">
                          <div className="planet-badge">♄ Сатурн</div>
                          <h4>♄ Сатурн в {sign} - {interpretation.quickSummary}</h4>
                        </div>
                        <button className="expand-btn" onClick={(e) => { e.stopPropagation(); toggleSection('saturn'); }}>
                          {expandedSections.saturn ? '▲ Свернуть' : '▼ Развернуть Детали'}
                        </button>
                      </div>
                      <p className="short-desc">{interpretation.description}</p>
                      {expandedSections.saturn && (
                        <div className="detailed-content">
                          <div className="planet-interpretation-grid">
                            <div className="interp-box lessons">
                              <h5>📖 Жизненные Уроки</h5>
                              <p><strong>Основной урок:</strong> {interpretation.lessons.primary}</p>
                              <p><strong>Вызов:</strong> {interpretation.lessons.challenge}</p>
                              <p><strong>Путь роста:</strong> {interpretation.lessons.growth}</p>
                              <p><strong>Мастерство:</strong> {interpretation.lessons.mastery}</p>
                            </div>
                            <div className="interp-box karmic">
                              <h5>🔮 Кармические Темы</h5>
                              <p><strong>Прошлая жизнь:</strong> {interpretation.karmic.pastLife}</p>
                              <p><strong>Эта жизнь:</strong> {interpretation.karmic.thisLife}</p>
                              <p><strong>Основной страх:</strong> {interpretation.karmic.fear}</p>
                            </div>
                            <div className="interp-box timeline">
                              <h5>⏳ Развитие во Времени</h5>
                              <p><strong>Раннее детство:</strong> {interpretation.earlyLife}</p>
                              <p><strong>После 30 лет:</strong> {interpretation.maturity}</p>
                            </div>
                            <div className="interp-box careers">
                              <h5>💼 Карьера для Мастерства</h5>
                              <p>{interpretation.careers}</p>
                            </div>
                          </div>
                          <div className="planet-advice-box saturn">
                            <h5>💡 Совет по Работе с Сатурном:</h5>
                            <p>{interpretation.advice}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}

                {/* Outer Planets Summary (Generational) */}
                <div className="outer-planets-summary">
                  <h4>🌌 Внешние Планеты (Поколенческие)</h4>
                  <p className="summary-text">
                    Уран, Нептун и Плутон медленно движутся и влияют на целые поколения.
                    Они показывают коллективные темы вашего времени и как вы связаны с эпохой.
                  </p>

                  {/* Uranus */}
                  {astroData.astrologyProfile.planets.Uranus && (() => {
                    const sign = astroData.astrologyProfile.planets.Uranus.sign
                    const interpretation = URANUS_IN_SIGNS[sign]
                    return interpretation && (
                      <div className="generational-planet-card uranus">
                        <div className="gen-header">
                          <h5>♅ Уран в {sign}</h5>
                          <span className="generation-badge">{interpretation.generation}</span>
                        </div>
                        <p className="gen-theme"><strong>Тема поколения:</strong> {interpretation.theme}</p>
                        <p className="gen-desc">{interpretation.description}</p>
                        <p className="gen-personal"><strong>Лично для вас:</strong> {interpretation.personal}</p>
                      </div>
                    )
                  })()}

                  {/* Neptune */}
                  {astroData.astrologyProfile.planets.Neptune && (() => {
                    const sign = astroData.astrologyProfile.planets.Neptune.sign
                    const interpretation = NEPTUNE_IN_SIGNS[sign]
                    return interpretation && (
                      <div className="generational-planet-card neptune">
                        <div className="gen-header">
                          <h5>♆ Нептун в {sign}</h5>
                          <span className="generation-badge">{interpretation.generation}</span>
                        </div>
                        <p className="gen-theme"><strong>Тема поколения:</strong> {interpretation.theme}</p>
                        <p className="gen-desc">{interpretation.description}</p>
                        <p className="gen-personal"><strong>Лично для вас:</strong> {interpretation.personal}</p>
                        <p className="gen-spiritual"><strong>Духовность:</strong> {interpretation.spiritual}</p>
                      </div>
                    )
                  })()}

                  {/* Pluto */}
                  {astroData.astrologyProfile.planets.Pluto && (() => {
                    const sign = astroData.astrologyProfile.planets.Pluto.sign
                    const interpretation = PLUTO_IN_SIGNS[sign]
                    return interpretation && (
                      <div className="generational-planet-card pluto">
                        <div className="gen-header">
                          <h5>♇ Плутон в {sign}</h5>
                          <span className="generation-badge">{interpretation.generation}</span>
                        </div>
                        <p className="gen-theme"><strong>Тема поколения:</strong> {interpretation.theme}</p>
                        <p className="gen-desc">{interpretation.description}</p>
                        <p className="gen-personal"><strong>Лично для вас:</strong> {interpretation.personal}</p>
                        <p className="gen-power"><strong>Ваша сила:</strong> {interpretation.power}</p>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* Houses */}
            {astroData.astrologyProfile.houses && (
              <div className="houses-section" id="houses">
                <h3>🏠 12 Домов Гороскопа</h3>
                <p className="section-description">
                  Дома показывают сферы жизни, где проявляется энергия планет
                </p>
                <div className="houses-grid">
                  {astroData.astrologyProfile.houses.slice(0, 6).map((house) => {
                    const houseMeaning = HOUSE_MEANINGS[house.number];
                    const isExpanded = expandedSections[`house${house.number}`];

                    return (
                      <div key={house.number} className="house-card expandable">
                        <div className="house-header" onClick={() => toggleSection(`house${house.number}`)}>
                          <div>
                            <div className="house-number">Дом {house.number}</div>
                            <h4>{house.name}</h4>
                            <div className="house-sign">Знак: {house.sign}</div>
                          </div>
                          <button className="expand-btn-small" onClick={(e) => { e.stopPropagation(); toggleSection(`house${house.number}`); }}>
                            {isExpanded ? '▲' : '▼'}
                          </button>
                        </div>
                        <p className="house-area">{house.represents}</p>
                        {!isExpanded && (
                          <div className="house-keywords">
                            {house.keywords.slice(0, 3).map((kw, idx) => (
                              <span key={idx} className="keyword-tag small">{kw}</span>
                            ))}
                          </div>
                        )}
                        {isExpanded && houseMeaning && (
                          <div className="house-detailed">
                            <div className="house-interpretation" style={{whiteSpace: 'pre-line'}}>
                              {houseMeaning.interpretation}
                            </div>
                            <div className="house-importance">
                              <strong>Важность:</strong> {houseMeaning.importance}
                            </div>
                            <div className="house-keywords">
                              {house.keywords.map((kw, idx) => (
                                <span key={idx} className="keyword-tag">{kw}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {astroData.astrologyProfile.houses.length > 6 && (
                  <button
                    onClick={() => toggleSection('allHouses')}
                    className="btn-secondary"
                    style={{ marginTop: 15 }}
                  >
                    {expandedSections.allHouses ? 'Скрыть дома 7-12' : 'Показать все 12 домов'}
                  </button>
                )}
                {expandedSections.allHouses && (
                  <div className="houses-grid" style={{ marginTop: 20 }}>
                    {astroData.astrologyProfile.houses.slice(6, 12).map((house) => {
                      const houseMeaning = HOUSE_MEANINGS[house.number];
                      const isExpanded = expandedSections[`house${house.number}`];

                      return (
                        <div key={house.number} className="house-card expandable">
                          <div className="house-header" onClick={() => toggleSection(`house${house.number}`)}>
                            <div>
                              <div className="house-number">Дом {house.number}</div>
                              <h4>{house.name}</h4>
                              <div className="house-sign">Знак: {house.sign}</div>
                            </div>
                            <button className="expand-btn-small" onClick={(e) => { e.stopPropagation(); toggleSection(`house${house.number}`); }}>
                              {isExpanded ? '▲' : '▼'}
                            </button>
                          </div>
                          <p className="house-area">{house.represents}</p>
                          {!isExpanded && (
                            <div className="house-keywords">
                              {house.keywords.slice(0, 3).map((kw, idx) => (
                                <span key={idx} className="keyword-tag small">{kw}</span>
                              ))}
                            </div>
                          )}
                          {isExpanded && houseMeaning && (
                            <div className="house-detailed">
                              <div className="house-interpretation" style={{whiteSpace: 'pre-line'}}>
                                {houseMeaning.interpretation}
                              </div>
                              <div className="house-importance">
                                <strong>Важность:</strong> {houseMeaning.importance}
                              </div>
                              <div className="house-keywords">
                                {house.keywords.map((kw, idx) => (
                                  <span key={idx} className="keyword-tag">{kw}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Aspects - Redesigned */}
            {astroData.astrologyProfile.aspects && astroData.astrologyProfile.aspects.length > 0 && (
              <div className="aspects-section-redesigned" id="aspects">
                <div className="section-header-fancy">
                  <div className="section-icon">🔗</div>
                  <h3>Планетарные Связи</h3>
                  <p className="section-subtitle">
                    Как ваши планеты работают вместе - ваши таланты и вызовы
                  </p>
                </div>

                {/* Summary Stats */}
                <div className="aspects-summary">
                  <div className="aspect-stat harmonious">
                    <span className="stat-number">{astroData.astrologyProfile.aspects.filter(a => a.nature === 'harmonious').length}</span>
                    <span className="stat-label">✓ Гармоничных</span>
                    <span className="stat-desc">Ваши таланты</span>
                  </div>
                  <div className="aspect-stat neutral">
                    <span className="stat-number">{astroData.astrologyProfile.aspects.filter(a => a.nature === 'neutral').length}</span>
                    <span className="stat-label">● Соединений</span>
                    <span className="stat-desc">Усиленные энергии</span>
                  </div>
                  <div className="aspect-stat challenging">
                    <span className="stat-number">{astroData.astrologyProfile.aspects.filter(a => a.nature === 'challenging').length}</span>
                    <span className="stat-label">⚠ Напряжённых</span>
                    <span className="stat-desc">Области роста</span>
                  </div>
                </div>

                <div className="aspects-intro-box">
                  <strong>💡 Что такое аспекты?</strong> Это углы между планетами в вашей карте.
                  Представьте планеты как музыкантов - аспекты показывают играют ли они в гармонии (✓), создают диссонанс для роста (⚠), или усиливают друг друга (●).
                </div>

                {/* Filter Buttons */}
                <div className="aspect-filters">
                  <button
                    className={`filter-btn ${aspectFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setAspectFilter('all')}
                  >
                    Все ({astroData.astrologyProfile.aspects.length})
                  </button>
                  <button
                    className={`filter-btn harmonious ${aspectFilter === 'harmonious' ? 'active' : ''}`}
                    onClick={() => setAspectFilter('harmonious')}
                  >
                    ✓ Гармоничные ({astroData.astrologyProfile.aspects.filter(a => a.nature === 'harmonious').length})
                  </button>
                  <button
                    className={`filter-btn neutral ${aspectFilter === 'neutral' ? 'active' : ''}`}
                    onClick={() => setAspectFilter('neutral')}
                  >
                    ● Соединения ({astroData.astrologyProfile.aspects.filter(a => a.nature === 'neutral').length})
                  </button>
                  <button
                    className={`filter-btn challenging ${aspectFilter === 'challenging' ? 'active' : ''}`}
                    onClick={() => setAspectFilter('challenging')}
                  >
                    ⚠ Напряжённые ({astroData.astrologyProfile.aspects.filter(a => a.nature === 'challenging').length})
                  </button>
                </div>

                {/* Filtered and sorted aspects list */}
                <div className="aspects-list">
                  {astroData.astrologyProfile.aspects
                    .filter(aspect => aspectFilter === 'all' || aspect.nature === aspectFilter)
                    .sort((a, b) => {
                      // First sort by nature (harmonious → neutral → challenging)
                      const natureOrder = { 'harmonious': 1, 'neutral': 2, 'challenging': 3 }
                      const aNature = natureOrder[a.nature] || 99
                      const bNature = natureOrder[b.nature] || 99

                      if (aNature !== bNature) return aNature - bNature

                      // Then sort by planet importance
                      const planetOrder = {
                        'Sun': 1, 'Moon': 2, 'Mercury': 3, 'Venus': 4, 'Mars': 5,
                        'Jupiter': 6, 'Saturn': 7, 'Uranus': 8, 'Neptune': 9, 'Pluto': 10
                      }

                      const a1 = planetOrder[a.planet1] || 99
                      const b1 = planetOrder[b.planet1] || 99

                      if (a1 !== b1) return a1 - b1

                      const a2 = planetOrder[a.planet2] || 99
                      const b2 = planetOrder[b.planet2] || 99

                      return a2 - b2
                    })
                    .map((aspect, idx) => {
                    // Translate planet names
                    const planetNames = {
                      'Sun': 'Солнце', 'Moon': 'Луна', 'Mercury': 'Меркурий',
                      'Venus': 'Венера', 'Mars': 'Марс', 'Jupiter': 'Юпитер',
                      'Saturn': 'Сатурн', 'Uranus': 'Уран', 'Neptune': 'Нептун', 'Pluto': 'Плутон'
                    };

                    const p1 = planetNames[aspect.planet1] || aspect.planet1;
                    const p2 = planetNames[aspect.planet2] || aspect.planet2;

                    // Get detailed interpretation from our library
                    const detailedAspect = getAspectInterpretation(aspect.planet1, aspect.planet2, aspect.type);

                    // Get aspect nature label
                    const getNatureLabel = (nature) => {
                      const labels = {
                        'harmonious': '✓ Гармоничный аспект',
                        'challenging': '⚠ Напряжённый аспект',
                        'neutral': '● Нейтральный аспект'
                      };
                      return labels[nature] || nature;
                    };

                    // Show all aspects - we have good fallback interpretations
                    return (
                      <div key={idx} className={`aspect-card nature-${aspect.nature}`}>
                        <div className="aspect-header">
                          <span className="aspect-symbol">{aspect.symbol}</span>
                          <h4>{p1} {aspect.type} {p2}</h4>
                        </div>
                        <div className={`aspect-nature ${aspect.nature}`}>
                          {getNatureLabel(aspect.nature)}
                        </div>
                        {detailedAspect ? (
                          <p className="aspect-meaning detailed" style={{whiteSpace: 'pre-line'}}>
                            {detailedAspect.interpretation}
                          </p>
                        ) : (aspect.interpretation && aspect.interpretation.length > 100) ? (
                          <p className="aspect-meaning">{aspect.interpretation}</p>
                        ) : (
                          <div className="aspect-meaning basic">
                            <p>{p1} и {p2}.</p>
                            <p style={{marginTop: '8px'}}>
                              <strong>Что это значит:</strong> {
                                (() => {
                                  const getPlanetMeaning = (planet, context) => {
                                    const meanings = {
                                      'Солнце': { subject: 'то, кто вы есть', with: 'вашей сущностью', area: 'самовыражении и личности' },
                                      'Луна': { subject: 'ваши эмоции и потребности', with: 'вашими чувствами', area: 'эмоциональной жизни' },
                                      'Меркурий': { subject: 'то, как вы думаете', with: 'вашим умом', area: 'мышлении и общении' },
                                      'Венера': { subject: 'то, что вы любите', with: 'вашими ценностями', area: 'любви и отношениях' },
                                      'Марс': { subject: 'то, как вы действуете', with: 'вашей энергией', area: 'действиях и инициативе' },
                                      'Юпитер': { subject: 'ваши возможности роста', with: 'вашим расширением', area: 'росте и удаче' },
                                      'Сатурн': { subject: 'ваши уроки и ограничения', with: 'вашей дисциплиной', area: 'ответственности и структуре' },
                                      'Уран': { subject: 'ваша свобода', with: 'вашей уникальностью', area: 'инновациях и бунте' },
                                      'Нептун': { subject: 'ваши мечты', with: 'вашей интуицией', area: 'духовности и воображении' },
                                      'Плутон': { subject: 'ваша сила', with: 'вашей трансформацией', area: 'глубинных изменениях' }
                                    };
                                    return meanings[planet]?.[context] || planet;
                                  };

                                  if (aspect.nature === 'harmonious') {
                                    return `${getPlanetMeaning(p1, 'subject')} гармонично сочетается с ${getPlanetMeaning(p2, 'with')}. Эти энергии поддерживают друг друга естественно - это ваш врождённый талант. В областях ${getPlanetMeaning(p1, 'area')} и ${getPlanetMeaning(p2, 'area')} вы особенно успешны. Развивайте этот дар!`;
                                  } else if (aspect.nature === 'challenging') {
                                    return `${getPlanetMeaning(p1, 'subject')} создаёт напряжение с ${getPlanetMeaning(p2, 'with')}. Эти энергии конфликтуют, требуя вашей работы над интеграцией. В областях ${getPlanetMeaning(p1, 'area')} и ${getPlanetMeaning(p2, 'area')} вы встречаете вызовы. Но именно через преодоление этого напряжения вы развиваете силу и мудрость.`;
                                  } else {
                                    return `${getPlanetMeaning(p1, 'subject')} объединено с ${getPlanetMeaning(p2, 'with')} в одной точке. Эти энергии слиты, усиливая друг друга. В областях ${getPlanetMeaning(p1, 'area')} и ${getPlanetMeaning(p2, 'area')} вы действуете с удвоенной силой. Направляйте эту мощную энергию осознанно.`;
                                  }
                                })()
                              }
                            </p>
                            {aspect.nature === 'harmonious' && (
                              <p style={{marginTop: '12px', padding: '12px', background: '#e8f5e9', borderRadius: '8px', fontSize: '13px'}}>
                                ✨ <strong>Совет:</strong> Этот дар даётся легко, но не забывайте его развивать. Лёгкость может привести к недооценке таланта.
                              </p>
                            )}
                            {aspect.nature === 'challenging' && (
                              <p style={{marginTop: '12px', padding: '12px', background: '#fff8e1', borderRadius: '8px', fontSize: '13px'}}>
                                💡 <strong>Помните:</strong> Напряжённые аспекты - не проклятие, а топливо для роста. Многие великие люди имеют сложные карты. Напряжение создаёт мотивацию развиваться.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Element Balance - Detailed Analysis */}
            {astroData.astrologyProfile.elementBalance && (
              <div className="element-balance-section" id="elements">
                <h3>🔥💧🌪️🌍 Баланс Элементов</h3>
                <p className="section-description">
                  Баланс 4 элементов показывает как вы взаимодействуете с миром
                </p>

                <div className="elements-grid">
                  <div className="element-card fire">
                    <div className="element-icon">🔥</div>
                    <h4>Огонь</h4>
                    <div className="element-bar">
                      <div className="element-fill" style={{ width: `${astroData.astrologyProfile.elementBalance?.['Огонь']?.percentage || astroData.astrologyProfile.elementBalance?.fire?.percentage || 0}%` }}></div>
                    </div>
                    <span className="element-percent">{astroData.astrologyProfile.elementBalance?.['Огонь']?.percentage || astroData.astrologyProfile.elementBalance?.fire?.percentage || 0}%</span>
                    <small>Энергия, действие, энтузиазм</small>
                  </div>

                  <div className="element-card earth">
                    <div className="element-icon">🌍</div>
                    <h4>Земля</h4>
                    <div className="element-bar">
                      <div className="element-fill" style={{ width: `${astroData.astrologyProfile.elementBalance?.['Земля']?.percentage || astroData.astrologyProfile.elementBalance?.earth?.percentage || 0}%` }}></div>
                    </div>
                    <span className="element-percent">{astroData.astrologyProfile.elementBalance?.['Земля']?.percentage || astroData.astrologyProfile.elementBalance?.earth?.percentage || 0}%</span>
                    <small>Практичность, стабильность</small>
                  </div>

                  <div className="element-card air">
                    <div className="element-icon">🌪️</div>
                    <h4>Воздух</h4>
                    <div className="element-bar">
                      <div className="element-fill" style={{ width: `${astroData.astrologyProfile.elementBalance?.['Воздух']?.percentage || astroData.astrologyProfile.elementBalance?.air?.percentage || 0}%` }}></div>
                    </div>
                    <span className="element-percent">{astroData.astrologyProfile.elementBalance?.['Воздух']?.percentage || astroData.astrologyProfile.elementBalance?.air?.percentage || 0}%</span>
                    <small>Интеллект, общение</small>
                  </div>

                  <div className="element-card water">
                    <div className="element-icon">💧</div>
                    <h4>Вода</h4>
                    <div className="element-bar">
                      <div className="element-fill" style={{ width: `${astroData.astrologyProfile.elementBalance?.['Вода']?.percentage || astroData.astrologyProfile.elementBalance?.water?.percentage || 0}%` }}></div>
                    </div>
                    <span className="element-percent">{astroData.astrologyProfile.elementBalance?.['Вода']?.percentage || astroData.astrologyProfile.elementBalance?.water?.percentage || 0}%</span>
                    <small>Эмоции, интуиция</small>
                  </div>
                </div>

                {/* Detailed Element Balance Analysis */}
                {(() => {
                  const analysis = getElementBalanceAnalysis(astroData.astrologyProfile.elementBalance);

                  return (
                    <div className="element-analysis-section">
                      {/* Dominant Element */}
                      {analysis.dominant && (
                        <div className={`element-interpretation-box dominant ${analysis.dominant.element}`}>
                          <h4>
                            {ELEMENT_DETAILED[analysis.dominant.element]?.icon} Доминирует: {ELEMENT_DETAILED[analysis.dominant.element]?.name}
                          </h4>
                          <div style={{whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: 14}}>
                            {analysis.dominant.interpretation}
                          </div>
                        </div>
                      )}

                      {/* Lacking Element */}
                      {analysis.lacking && (
                        <div className={`element-interpretation-box lacking ${analysis.lacking.element}`}>
                          <h4>
                            {ELEMENT_DETAILED[analysis.lacking.element]?.icon} Недостаёт: {ELEMENT_DETAILED[analysis.lacking.element]?.name}
                          </h4>
                          <div style={{whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: 14}}>
                            {analysis.lacking.interpretation}
                          </div>
                        </div>
                      )}

                      {/* Balanced */}
                      {analysis.isBalanced && (
                        <div className="element-interpretation-box balanced">
                          <h4>⚖️ Гармоничный Баланс</h4>
                          <p style={{lineHeight: 1.7, fontSize: 14}}>
                            Ваши элементы находятся в хорошем балансе! Это редкость и дар. Вы можете использовать энергию любого элемента когда нужно - действовать (Огонь), думать (Воздух), чувствовать (Вода), воплощать (Земля). Эта гибкость позволяет вам адаптироваться к любой ситуации.
                          </p>
                        </div>
                      )}

                      {/* Original summary if exists */}
                      {astroData.astrologyProfile.chartSummary && (
                        <div className="chart-summary-box">
                          <h4>📊 Общий Анализ:</h4>
                          <p className="summary-overview">{astroData.astrologyProfile.chartSummary.overview}</p>
                          {astroData.astrologyProfile.chartSummary.lackingElement && (
                            <p className="summary-advice">
                              💡 <strong>Совет:</strong> {astroData.astrologyProfile.chartSummary.lackingAdvice}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="back-to-top-btn"
            style={{
              position: 'fixed',
              bottom: '32px',
              right: '32px',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              zIndex: 1000,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            ⬆️
          </button>
        )}
      </main>
    </div>
  )
}

export default NatalChartPage
