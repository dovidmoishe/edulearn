import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { BRAND_COLORS, BRAND_FONTS } from '../../constants/theme';

/**
 * Scene 3: Call-to-Action (8-10s | Frames 0-60)
 * High-energy finale with impact
 */
export const Scene4_CTA: React.FC = () => {
  const frame = useCurrentFrame();

  // Heading zoom in with impact
  const headingScale = interpolate(
    frame,
    [0, 20],
    [0.7, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.4)),
    }
  );

  const headingOpacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Button pops in
  const buttonScale = interpolate(
    frame,
    [15, 30],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.7)),
    }
  );

  const buttonOpacity = interpolate(
    frame,
    [15, 25],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Button pulse after appearing
  const buttonPulse = frame > 30 ? 1 + Math.sin((frame - 30) * 0.2) * 0.05 : 1;

  // Glow intensity
  const glowIntensity = interpolate(
    frame,
    [20, 40],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Brand reveal
  const brandY = interpolate(
    frame,
    [40, 55],
    [30, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.3)),
    }
  );

  const brandOpacity = interpolate(
    frame,
    [40, 50],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND_COLORS.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {/* Radial glow background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at center, ${BRAND_COLORS.primary}${Math.floor(glowIntensity * 20).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Main content */}
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 48,
        }}
      >
        {/* Heading */}
        <div
          style={{
            opacity: headingOpacity,
            transform: `scale(${headingScale})`,
          }}
        >
          <h1
            style={{
              fontSize: 76,
              fontFamily: BRAND_FONTS.family,
              fontWeight: BRAND_FONTS.weights.bold,
              color: BRAND_COLORS.text,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              margin: 0,
              textShadow: `0 0 ${glowIntensity * 60}px ${BRAND_COLORS.primary}40`,
            }}
          >
            Join the Movement
          </h1>
        </div>

        {/* CTA Button with glow */}
        <div
          style={{
            opacity: buttonOpacity,
            transform: `scale(${buttonScale * buttonPulse})`,
          }}
        >
          <div
            style={{
              backgroundColor: BRAND_COLORS.primary,
              color: BRAND_COLORS.background,
              padding: '24px 64px',
              borderRadius: '16px',
              fontSize: 36,
              fontFamily: BRAND_FONTS.family,
              fontWeight: BRAND_FONTS.weights.bold,
              letterSpacing: '-0.01em',
              boxShadow: `
                0 0 ${glowIntensity * 40}px ${BRAND_COLORS.primary},
                0 0 ${glowIntensity * 80}px ${BRAND_COLORS.primary}40,
                0 8px 32px rgba(0, 0, 0, 0.6)
              `,
              position: 'relative',
            }}
          >
            Get Started Free
            {/* Button shine effect */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: interpolate(frame, [20, 60], [-200, 400], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                width: 100,
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Brand footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: `translateX(-50%) translateY(${brandY}px)`,
          opacity: brandOpacity,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontFamily: BRAND_FONTS.family,
            fontWeight: BRAND_FONTS.weights.bold,
            background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, #00CC66 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
            marginBottom: 8,
          }}
        >
          EduLearn
        </div>
        <div
          style={{
            fontSize: BRAND_FONTS.sizes.body,
            fontFamily: BRAND_FONTS.family,
            fontWeight: BRAND_FONTS.weights.regular,
            color: BRAND_COLORS.textMuted,
          }}
        >
          edulearn.fun
        </div>
      </div>
    </AbsoluteFill>
  );
};
