import { useEffect, useRef, memo } from 'react';
import './MysticalParticles.css';

/**
 * Mystical Particles Background Effect
 * Creates floating stars, sparkles and mystical orbs
 */
const MysticalParticles = memo(function MysticalParticles({
  particleCount = 50,
  starCount = 30,
  showOrbs = true,
  intensity = 'medium' // 'low', 'medium', 'high'
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';

    // Intensity multipliers
    const intensityMultiplier = { low: 0.5, medium: 1, high: 1.5 }[intensity];
    const actualParticles = Math.floor(particleCount * intensityMultiplier);
    const actualStars = Math.floor(starCount * intensityMultiplier);

    // Create floating particles (sparkles)
    for (let i = 0; i < actualParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'mystical-particle';

      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      // Random animation delay and duration
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${3 + Math.random() * 4}s`;

      // Random size (small sparkles)
      const size = 2 + Math.random() * 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      container.appendChild(particle);
    }

    // Create twinkling stars
    for (let i = 0; i < actualStars; i++) {
      const star = document.createElement('div');
      star.className = 'mystical-star';

      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;

      // Random animation
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${2 + Math.random() * 2}s`;

      // Random size
      const size = 1 + Math.random() * 2;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      container.appendChild(star);
    }

    // Create mystical orbs (larger glowing circles)
    if (showOrbs) {
      const orbCount = Math.floor(5 * intensityMultiplier);
      for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        orb.className = 'mystical-orb';

        // Random position
        orb.style.left = `${10 + Math.random() * 80}%`;
        orb.style.top = `${10 + Math.random() * 80}%`;

        // Random animation
        orb.style.animationDelay = `${Math.random() * 10}s`;
        orb.style.animationDuration = `${15 + Math.random() * 10}s`;

        // Random size
        const size = 100 + Math.random() * 200;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;

        // Random color variant
        const hue = 240 + Math.random() * 60; // Purple to blue range
        orb.style.background = `radial-gradient(circle, hsla(${hue}, 70%, 60%, 0.1) 0%, transparent 70%)`;

        container.appendChild(orb);
      }
    }

    // Cleanup
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [particleCount, starCount, showOrbs, intensity]);

  return (
    <div
      ref={containerRef}
      className="mystical-particles-container"
      aria-hidden="true"
    />
  );
});

export default MysticalParticles;
