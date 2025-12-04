import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JournalSEO } from '../components/SEO'
import './JournalPage.css';

const JournalPage = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [reflectionEntries, setReflectionEntries] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    tags: [],
    mood: '',
    startDate: '',
    endDate: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJournalData();
  }, [filters]);

  const fetchJournalData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.tags.length > 0) params.append('tags', filters.tags.join(','));
      if (filters.mood) params.append('mood', filters.mood);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const [entriesRes, tagsRes, reflectionRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/journal?${params}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/journal/tags`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/journal/reflection`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (entriesRes.data.success) setEntries(entriesRes.data.data.entries);
      if (tagsRes.data.success) setAllTags(tagsRes.data.data);
      if (reflectionRes.data.success) setReflectionEntries(reflectionRes.data.data);
    } catch (error) {
      console.error('Error fetching journal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/journal/export`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const dataStr = JSON.stringify(response.data.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tarot-journal-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Ошибка при экспорте дневника');
    }
  };

  const getMoodEmoji = (mood) => {
    const moods = {
      happy: '😊',
      sad: '😔',
      anxious: '😰',
      excited: '🤩',
      peaceful: '😌',
      confused: '😕'
    };
    return moods[mood] || '📝';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Statistics
  const stats = {
    total: entries.length,
    thisWeek: entries.filter(e => {
      const entryDate = new Date(e.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length,
    mostUsedMood: entries.length > 0 ?
      (Object.entries(
        entries.reduce((acc, e) => {
          if (e.journal.mood) acc[e.journal.mood] = (acc[e.journal.mood] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || null)
      : null
  };

  return (
    <div className="journal-page">
      <JournalSEO />
      <div className="journal-header">
        <h1>📔 Дневник Таро</h1>
        <p>Ваши записи, мысли и инсайты о раскладах</p>

        {entries.length > 0 && (
          <div className="journal-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Всего записей</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.thisWeek}</div>
              <div className="stat-label">На этой неделе</div>
            </div>
            {stats.mostUsedMood && (
              <div className="stat-card">
                <div className="stat-number">{getMoodEmoji(stats.mostUsedMood)}</div>
                <div className="stat-label">Частое настроение</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="journal-controls">
        <input
          type="text"
          placeholder="🔍 Поиск по заметкам..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="search-input"
        />

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle-btn"
        >
          {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </button>

        <button onClick={handleExport} className="export-btn">
          📥 Экспорт
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-section">
          <div className="filter-group">
            <label>Настроение:</label>
            <select
              value={filters.mood}
              onChange={(e) => setFilters({ ...filters, mood: e.target.value })}
            >
              <option value="">Все</option>
              <option value="happy">😊 Радость</option>
              <option value="sad">😔 Грусть</option>
              <option value="anxious">😰 Тревога</option>
              <option value="excited">🤩 Воодушевление</option>
              <option value="peaceful">😌 Спокойствие</option>
              <option value="confused">😕 Смущение</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Период с:</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>по:</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>

          <button
            onClick={() => setFilters({ search: '', tags: [], mood: '', startDate: '', endDate: '' })}
            className="clear-filters-btn"
          >
            Сбросить фильтры
          </button>
        </div>
      )}

      {/* Reflection Section */}
      {reflectionEntries.length > 0 && (
        <div className="reflection-section">
          <h2>🔮 Рефлексия: месяц назад</h2>
          <p>Вспомните, о чём вы думали месяц назад</p>
          <div className="reflection-grid">
            {reflectionEntries.map((entry) => (
              <div key={entry._id} className="reflection-card">
                <div className="reflection-date">{formatDate(entry.createdAt)}</div>
                <div className="reflection-question">{entry.question || entry.readingType}</div>
                <div className="reflection-note">{entry.journal.note.substring(0, 100)}...</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entries */}
      <div className="entries-section">
        <h2>Все записи ({entries.length})</h2>

        {loading ? (
          <div className="loading">Загрузка записей...</div>
        ) : entries.length === 0 ? (
          <div className="no-entries-expanded">
            <div className="empty-icon">📔✨</div>
            <h2>Начните вести дневник Таро</h2>
            <p className="empty-subtitle">Дневник поможет вам глубже понять послания карт и отследить закономерности</p>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🔮</div>
                <h3>Развивайте интуицию</h3>
                <p>Записывайте первые впечатления от карт, а потом сравнивайте с реальностью</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">📊</div>
                <h3>Отслеживайте паттерны</h3>
                <p>Замечайте, какие карты появляются чаще, и что они значат для вас</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">💡</div>
                <h3>Сохраняйте инсайты</h3>
                <p>Фиксируйте озарения, чтобы они не забылись через день-два</p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">🌱</div>
                <h3>Наблюдайте рост</h3>
                <p>Перечитывайте старые записи и видите, как меняетесь вы и ваша жизнь</p>
              </div>
            </div>

            <div className="cta-section">
              <h3>Как начать?</h3>
              <div className="cta-steps">
                <div className="cta-step">
                  <span className="step-number">1</span>
                  <p>Сделайте расклад в любом разделе</p>
                </div>
                <div className="cta-step">
                  <span className="step-number">2</span>
                  <p>После расклада добавьте заметку</p>
                </div>
                <div className="cta-step">
                  <span className="step-number">3</span>
                  <p>Ваши записи появятся здесь</p>
                </div>
              </div>

              <div className="cta-buttons">
                <button onClick={() => navigate('/single-card')} className="cta-btn primary">
                  🎴 Карта Дня
                </button>
                <button onClick={() => navigate('/three-card')} className="cta-btn">
                  🔮 Расклад на 3 карты
                </button>
                <button onClick={() => navigate('/history')} className="cta-btn outline">
                  📜 История раскладов
                </button>
              </div>
            </div>

            <div className="tips-section">
              <h3>💫 Советы по ведению дневника</h3>
              <ul className="tips-list">
                <li><strong>Записывайте сразу:</strong> Первые впечатления самые точные</li>
                <li><strong>Будьте честны:</strong> Дневник только для вас, пишите без прикрас</li>
                <li><strong>Добавляйте контекст:</strong> Что происходило в жизни, какое было настроение</li>
                <li><strong>Возвращайтесь к записям:</strong> Через неделю или месяц перечитайте и добавьте мысли</li>
                <li><strong>Используйте теги:</strong> Так будет проще находить записи на похожие темы</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="entries-list">
            {entries.map((entry) => (
              <div key={entry._id} className="journal-entry">
                <div className="entry-header">
                  <div className="entry-date-mood">
                    {entry.journal.mood && (
                      <span className="entry-mood">{getMoodEmoji(entry.journal.mood)}</span>
                    )}
                    <span className="entry-date">{formatDate(entry.createdAt)}</span>
                  </div>
                  <span className="entry-type-badge">{entry.readingType}</span>
                </div>

                {entry.question && (
                  <div className="entry-question">
                    <strong>Вопрос:</strong> {entry.question}
                  </div>
                )}

                <div className="entry-note">
                  {entry.journal.note}
                </div>

                {entry.journal.insights && (
                  <div className="entry-insights">
                    <strong>💡 Инсайты:</strong> {entry.journal.insights}
                  </div>
                )}

                {entry.journal.tags && entry.journal.tags.length > 0 && (
                  <div className="entry-tags">
                    {entry.journal.tags.map((tag, idx) => (
                      <span key={idx} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="entry-cards-preview">
                  {entry.cards && entry.cards.slice(0, 3).map((card, idx) => (
                    <span key={idx} className="card-mini">{card.name}</span>
                  ))}
                  {entry.cards && entry.cards.length > 3 && (
                    <span className="card-mini-more">+{entry.cards.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalPage;
