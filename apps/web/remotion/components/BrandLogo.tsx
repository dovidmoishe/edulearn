import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { BRAND_COLORS, ANIMATION_CONFIG } from '../constants/theme';

interface BrandLogoProps {
  startFrame?: number;
  x?: number;
  y?: number;
  size?: number;
  showGlow?: boolean;
  pulse?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  startFrame = 0,
  x = 540,
  y = 540,
  size = 120,
  showGlow = true,
  pulse = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = Math.max(0, frame - startFrame);

  // Scale animation using spring
  const scale = spring({
    frame: relativeFrame,
    fps,
    config: ANIMATION_CONFIG.spring.default,
  });

  // Pulse effect (if enabled)
  const pulseScale = pulse
    ? 1 + Math.sin((frame / fps) * Math.PI * 2) * 0.05
    : 1;

  // Glow intensity animation
  const glowIntensity = interpolate(
    relativeFrame,
    [0, 30, 60],
    [0, 20, 15],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  if (relativeFrame < 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale * pulseScale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      {/* Actual EduLearn Logo */}
      <Img
        src={staticFile('/assets/icons/LOGO1.png')}
        alt="EduLearn Logo"
        style={{
          width: size,
          height: 'auto',
          filter: showGlow
            ? `drop-shadow(0 0 ${glowIntensity}px ${BRAND_COLORS.primary})
               drop-shadow(0 0 ${glowIntensity * 2}px ${BRAND_COLORS.primary})`
            : 'none',
        }}
      />

      {/* Glow circle behind logo */}
      {showGlow && (
        <div
          style={{
            position: 'absolute',
            width: size * 2,
            height: size * 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND_COLORS.primary}33 0%, transparent 70%)`,
            zIndex: -1,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </div>
  );
};
