import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { BRAND_COLORS } from '../constants/theme';

interface Particle {
  id: number;
  angle: number;
  speed: number;
  size: number;
}

interface ParticleGlowProps {
  particleCount?: number;
  duration?: number;
  startFrame?: number;
  radius?: number;
  centerX?: number;
  centerY?: number;
}

export const ParticleGlow: React.FC<ParticleGlowProps> = ({
  particleCount = 50,
  duration = 60,
  startFrame = 0,
  radius = 100,
  centerX = 540,
  centerY = 540,
}) => {
  const frame = useCurrentFrame();

  // Generate particles
  const particles: Particle[] = React.useMemo(
    () =>
      Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        angle: (i / particleCount) * Math.PI * 2,
        speed: 2 + Math.random() * 3,
        size: 1 + Math.random() * 2,
      })),
    [particleCount]
  );

  // Calculate progress based on frame
  const relativeFrame = Math.max(0, frame - startFrame);
  const progress = interpolate(relativeFrame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {particles.map((particle) => {
        const distance = radius * progress * particle.speed;
        const x = centerX + Math.cos(particle.angle) * distance;
        const y = centerY + Math.sin(particle.angle) * distance;
        const opacity = 1 - progress;

        return (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: BRAND_COLORS.primary,
              opacity,
              boxShadow: `0 0 ${particle.size * 5}px ${BRAND_COLORS.primary}`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
};
