import { ACHIEVEMENTS } from '../constants/achievements'
import './AchievementBadge.css'

function AchievementBadge({ achievementId, unlocked = false, size = 'medium' }) {
  const achievement = ACHIEVEMENTS[achievementId];

  if (!achievement) return null;

  return (
    <div className={`achievement-badge ${unlocked ? 'unlocked' : 'locked'} size-${size}`}>
      <div className="badge-icon">{achievement.icon}</div>
      <div className="badge-info">
        <div className="badge-name">{achievement.name}</div>
        {size !== 'small' && (
          <div className="badge-description">{achievement.description}</div>
        )}
      </div>
      {!unlocked && <div className="badge-lock">🔒</div>}
    </div>
  );
}

export default AchievementBadge;
