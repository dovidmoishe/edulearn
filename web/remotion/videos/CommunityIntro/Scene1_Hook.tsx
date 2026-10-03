import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { BRAND_COLORS, BRAND_FONTS } from '../../constants/theme';

/**
 * Scene 1: Hero Hook (0-3s | Frames 0-90)
 * Bold, energetic opening with smooth reveals
 */
export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // Main text - split word reveals with energy
  const word1Opacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const word1Y = interpolate(frame, [5, 20], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.5)),
  });

  const word2Opacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const word2Y = interpolate(frame, [15, 30], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.5)),
  });

  // Subtitle
  const subtitleOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Glow effect intensity
  const glowIntensity = interpolate(frame, [20, 40, 70, 90], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit fade
  const exitOpacity = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.ease),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND_COLORS.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: exitOpacity,
      }}
    >
      {/* Radial gradient background glow */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at center, ${BRAND_COLORS.primary}${Math.floor(glowIntensity * 15).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ textAlign: 'center', position: 'relative' }}>
        {/* Main heading - word by word reveal */}
        <div style={{ marginBottom: 24 }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: 80,
              fontFamily: BRAND_FONTS.family,
              fontWeight: BRAND_FONTS.weights.bold,
              color: BRAND_COLORS.text,
              letterSpacing: '-0.03em',
              opacity: word1Opacity,
              transform: `translateY(${word1Y}px)`,
              marginRight: 24,
            }}
          >
            Learn
          </span>
          <span
            style={{
              display: 'inline-block',
              fontSize: 80,
              fontFamily: BRAND_FONTS.family,
              fontWeight: BRAND_FONTS.weights.bold,
              background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, #00CC66 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              opacity: word2Opacity,
              transform: `translateY(${word2Y}px)`,
              textShadow: glowIntensity > 0 ? `0 0 ${glowIntensity * 40}px ${BRAND_COLORS.primary}` : 'none',
            }}
          >
            Together
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            fontFamily: BRAND_FONTS.family,
            fontWeight: BRAND_FONTS.weights.regular,
            color: BRAND_COLORS.textMuted,
            opacity: subtitleOpacity,
            letterSpacing: '-0.01em',
          }}
        >
          Join thousands of learners in real-time
        </div>

        {/* Animated underline */}
        <div
          style={{
            marginTop: 32,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${BRAND_COLORS.primary}, transparent)`,
            width: interpolate(frame, [40, 60], [0, 300], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.ease),
            }),
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: subtitleOpacity,
            boxShadow: `0 0 ${glowIntensity * 20}px ${BRAND_COLORS.primary}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
