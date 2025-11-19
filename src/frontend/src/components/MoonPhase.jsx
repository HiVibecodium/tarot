import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MoonPhase.css';

const MoonPhase = ({ showDetails = false, size = 'medium' }) => {
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMoonPhase();
  }, []);

  const fetchMoonPhase = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/moon/current`);
      if (response.data.success) {
        setMoonData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching moon phase:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`moon-phase-widget ${size}`}>
        <span className="moon-emoji">🌙</span>
        <span className="moon-loading">Загрузка...</span>
      </div>
    );
  }

  if (!moonData) return null;

  const handleClick = () => {
    navigate('/moon-calendar');
  };

  return (
    <div
      className={`moon-phase-widget ${size} ${showDetails ? 'detailed' : ''}`}
      onClick={handleClick}
      title="Нажмите для подробностей"
    >
      <div className="moon-icon-container">
        <span className="moon-emoji">{moonData.emoji}</span>
        {size !== 'small' && (
          <span className="moon-illumination">{moonData.illumination}%</span>
        )}
      </div>

      <div className="moon-info">
        <div className="moon-phase-name">{moonData.phaseName}</div>
        {showDetails && (
          <>
            <div className="moon-description">{moonData.description}</div>
            <div className="moon-energy">
              <strong>Энергия:</strong> {moonData.energy}
            </div>
            {moonData.recommendations?.tarot && (
              <div className="moon-tarot-tip">
                {moonData.recommendations.tarot}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MoonPhase;
