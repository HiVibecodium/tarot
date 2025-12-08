import { useEffect, useRef, memo, useState } from 'react';
import './MysticalParticles.css';

/**
 * Mystical Particles Background Effect
 * Creates floating stars, sparkles and mystical orbs
 * Optimized for mobile devices and respects reduced motion preferences
 */
const MysticalParticles = memo(function MysticalParticles({
  particleCount = 50,
  starCount = 30,
  showOrbs = true,
  intensity = 'medium' // 'low', 'medium', 'high'
}) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect mobile and reduced motion on mount
  useEffect(() => {
    const checkMobile = () => window.innerWidth <= 768;
    const checkReducedMotion = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setIsMobile(checkMobile());
    setPrefersReducedMotion(checkReducedMotion());

    const handleResize = () => setIsMobile(checkMobile());
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Skip animations if user prefers reduced motion
    if (prefersReducedMotion) {
      containerRef.current.innerHTML = '';
      return;
    }

    const container = containerRef.current;
    const fragment = document.createDocumentFragment();

    // Reduce particles on mobile for better performance
    const mobileMultiplier = isMobile ? 0.4 : 1;
    const intensityMultiplier = { low: 0.5, medium: 1, high: 1.5 }[intensity];
    const finalMultiplier = mobileMultiplier * intensityMultiplier;

    const actualParticles = Math.floor(particleCount * finalMultiplier);
    const actualStars = Math.floor(starCount * finalMultiplier);

    // Create floating particles (sparkles)
    for (let i = 0; i < actualParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'mystical-particle';
      particle.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 5}s;
        animation-duration: ${3 + Math.random() * 4}s;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
      `;
      fragment.appendChild(particle);
    }

    // Create twinkling stars
    for (let i = 0; i < actualStars; i++) {
      const star = document.createElement('div');
      star.className = 'mystical-star';
      const size = 1 + Math.random() * 2;
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 3}s;
        animation-duration: ${2 + Math.random() * 2}s;
        width: ${size}px;
        height: ${size}px;
      `;
      fragment.appendChild(star);
    }

    // Create mystical orbs (larger glowing circles) - fewer on mobile
    if (showOrbs) {
      const orbCount = Math.floor((isMobile ? 2 : 5) * intensityMultiplier);
      for (let i = 0; i < orbCount; i++) {
        const orb = document.createElement('div');
        orb.className = 'mystical-orb';
        const size = isMobile ? 80 + Math.random() * 100 : 100 + Math.random() * 200;
        const hue = 240 + Math.random() * 60;
        orb.style.cssText = `
          left: ${10 + Math.random() * 80}%;
          top: ${10 + Math.random() * 80}%;
          animation-delay: ${Math.random() * 10}s;
          animation-duration: ${15 + Math.random() * 10}s;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle, hsla(${hue}, 70%, 60%, 0.1) 0%, transparent 70%);
        `;
        fragment.appendChild(orb);
      }
    }

    // Clear and append all at once (more efficient)
    container.innerHTML = '';
    container.appendChild(fragment);

    // Cleanup
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [particleCount, starCount, showOrbs, intensity, isMobile, prefersReducedMotion]);

  // Don't render anything if reduced motion is preferred
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="mystical-particles-container"
      aria-hidden="true"
    />
  );
});

export default MysticalParticles;
