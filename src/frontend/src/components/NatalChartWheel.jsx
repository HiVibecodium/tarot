/**
 * Natal Chart Wheel Visualization
 * Circular chart showing planets and houses
 */

import './NatalChartWheel.css';

const ZODIAC_SYMBOLS = {
  'Овен': '♈',
  'Телец': '♉',
  'Близнецы': '♊',
  'Рак': '♋',
  'Лев': '♌',
  'Дева': '♍',
  'Весы': '♎',
  'Скорпион': '♏',
  'Стрелец': '♐',
  'Козерог': '♑',
  'Водолей': '♒',
  'Рыбы': '♓'
};

function NatalChartWheel({ astroData }) {
  if (!astroData) return null;

  const { sunSign, moonSign, risingSign, planets, houses } = astroData;

  return (
    <div className="natal-chart-wheel">
      <svg viewBox="0 0 400 400" className="chart-svg">
        {/* Background gradient */}
        <defs>
          <radialGradient id="chartGradient">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8f9fa" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="url(#chartGradient)" />

        {/* Outer circle */}
        <circle cx="200" cy="200" r="180" fill="none" stroke="#667eea" strokeWidth="3" />

        {/* Middle circle */}
        <circle cx="200" cy="200" r="140" fill="none" stroke="#764ba2" strokeWidth="1.5" strokeDasharray="5,5" />

        {/* Inner circle */}
        <circle cx="200" cy="200" r="100" fill="none" stroke="#667eea" strokeWidth="2" />

        {/* House division lines (12 houses) */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 200 + Math.cos(angle) * 100;
          const y1 = 200 + Math.sin(angle) * 100;
          const x2 = 200 + Math.cos(angle) * 180;
          const y2 = 200 + Math.sin(angle) * 180;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          );
        })}

        {/* Zodiac signs (outer ring) */}
        {Object.entries(ZODIAC_SYMBOLS).map(([ sign, symbol], index) => {
          const angle = (index * 30 - 90) * (Math.PI / 180);
          const x = 200 + Math.cos(angle) * 160;
          const y = 200 + Math.sin(angle) * 160;

          return (
            <text
              key={sign}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
              fill="#667eea"
            >
              {symbol}
            </text>
          );
        })}

        {/* Sun position */}
        {sunSign && (
          <g>
            <circle cx="200" cy="120" r="15" fill="#FFD700" />
            <text x="200" y="125" textAnchor="middle" fontSize="20">☉</text>
          </g>
        )}

        {/* Moon position */}
        {moonSign && (
          <g>
            <circle cx="260" cy="160" r="12" fill="#C0C0C0" />
            <text x="260" y="165" textAnchor="middle" fontSize="18">☽</text>
          </g>
        )}

        {/* Rising sign indicator */}
        {risingSign && (
          <g>
            <line x1="200" y1="200" x2="360" y2="200" stroke="#e74c3c" strokeWidth="2" />
            <circle cx="360" cy="200" r="3" fill="#e74c3c" />
            <text x="200" y="250" textAnchor="middle" fontSize="12" fill="#e74c3c" fontWeight="600">
              ASC (Восходящий)
            </text>
          </g>
        )}

        {/* Center info - Enhanced */}
        <circle cx="200" cy="200" r="60" fill="white" opacity="0.9" />
        <text x="200" y="190" textAnchor="middle" fontSize="16" fill="#667eea" fontWeight="700">
          {sunSign?.sign || 'Ваша'}
        </text>
        <text x="200" y="210" textAnchor="middle" fontSize="12" fill="#999">
          Натальная Карта
        </text>
        <text x="200" y="225" textAnchor="middle" fontSize="10" fill="#ccc">
          {new Date().toLocaleDateString('ru-RU')}
        </text>

        {/* House numbers (in the houses ring) */}
        {houses && houses.slice(0, 12).map((house, i) => {
          const angle = (i * 30 - 75) * (Math.PI / 180);
          const x = 200 + Math.cos(angle) * 120;
          const y = 200 + Math.sin(angle) * 120;
          return (
            <text
              key={`house-${i}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill="#999"
              fontWeight="600"
            >
              {house.number}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-symbol">☉</span>
          <span className="legend-text">Солнце: {sunSign?.sign}</span>
        </div>
        {moonSign && (
          <div className="legend-item">
            <span className="legend-symbol">☽</span>
            <span className="legend-text">Луна: {moonSign.sign}</span>
          </div>
        )}
        {risingSign && (
          <div className="legend-item">
            <span className="legend-symbol">ASC</span>
            <span className="legend-text">Восходящий: {risingSign.sign}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default NatalChartWheel;
