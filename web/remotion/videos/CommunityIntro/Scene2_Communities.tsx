import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, Easing } from 'remotion';
import { BRAND_COLORS, BRAND_FONTS } from '../../constants/theme';

interface Message {
  username: string;
  text: string;
  startFrame: number;
  color: string;
}

const messages: Message[] = [
  {
    username: 'Alex',
    text: 'Just finished the Web3 module! 🚀',
    startFrame: 20,
    color: '#4A85E4',
  },
  {
    username: 'Sarah',
    text: 'Amazing! Want to work on the project together?',
    startFrame: 50,
    color: '#F5B546',
  },
  {
    username: 'Mike',
    text: "I'm in! Let's build something cool 🔥",
    startFrame: 80,
    color: '#40B869',
  },
];

/**
 * Scene 2: Community Chat (3-8s | Frames 0-150)
 * Energetic chat interface with smooth animations
 */
export const Scene2_Communities: React.FC = () => {
  const frame = useCurrentFrame();

  // Chat window slide in from bottom
  const containerY = interpolate(
    frame,
    [0, 25],
    [100, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.2)),
    }
  );

  const containerOpacity = interpolate(
    frame,
    [0, 20],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Header animations
  const headerScale = interpolate(
    frame,
    [10, 30],
    [0.9, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.back(1.5)),
    }
  );

  const headerOpacity = interpolate(
    frame,
    [10, 25],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Online pulse effect
  const onlinePulse = Math.sin(frame * 0.15) * 0.3 + 0.7;

  const Message: React.FC<Message> = ({ username, text, startFrame, color }) => {
    const relativeFrame = Math.max(0, frame - startFrame);

    const opacity = interpolate(
      relativeFrame,
      [0, 12],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.ease),
      }
    );

    const translateX = interpolate(
      relativeFrame,
      [0, 18],
      [-60, 0],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.back(1.3)),
      }
    );

    const scale = interpolate(
      relativeFrame,
      [0, 18],
      [0.9, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.back(1.2)),
      }
    );

    if (relativeFrame < 0) return null;

    return (
      <div
        style={{
          opacity,
          transform: `translateX(${translateX}px) scale(${scale})`,
          marginBottom: 20,
        }}
      >
        {/* Username with avatar dot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: BRAND_FONTS.weights.bold,
              color: '#000',
            }}
          >
            {username[0]}
          </div>
          <span
            style={{
              fontSize: BRAND_FONTS.sizes.caption,
              fontFamily: BRAND_FONTS.family,
              fontWeight: BRAND_FONTS.weights.bold,
              color: BRAND_COLORS.text,
              letterSpacing: '0.02em',
            }}
          >
            {username}
          </span>
        </div>

        {/* Message bubble with glow */}
        <div
          style={{
            backgroundColor: BRAND_COLORS.card,
            border: `1px solid ${color}40`,
            borderRadius: '16px',
            padding: '18px 24px',
            fontSize: BRAND_FONTS.sizes.body,
            fontFamily: BRAND_FONTS.family,
            fontWeight: BRAND_FONTS.weights.regular,
            color: BRAND_COLORS.text,
            lineHeight: BRAND_FONTS.lineHeights.normal,
            maxWidth: 650,
            marginLeft: 42,
            boxShadow: `0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px ${color}20`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: `linear-gradient(180deg, ${color}08 0%, transparent 100%)`,
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>{text}</div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND_COLORS.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Subtle animated background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.02) * 20}% ${50 + Math.cos(frame * 0.03) * 20}%, ${BRAND_COLORS.primary}05 0%, transparent 50%)`,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          opacity: containerOpacity,
          transform: `translateY(${containerY}px)`,
          width: 800,
          maxWidth: '90%',
        }}
      >
        {/* Community header */}
        <div
          style={{
            marginBottom: 48,
            textAlign: 'center',
            transform: `scale(${headerScale})`,
            opacity: headerOpacity,
          }}
        >
          <h2
            style={{
              fontSize: 42,
              fontFamily: BRAND_FONTS.family,
              fontWeight: BRAND_FONTS.weights.bold,
              color: BRAND_COLORS.text,
              margin: 0,
              marginBottom: 12,
              letterSpacing: '-0.02em',
            }}
          >
            Blockchain Builders
          </h2>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: BRAND_COLORS.card,
              padding: '8px 20px',
              borderRadius: '24px',
              border: `1px solid ${BRAND_COLORS.primary}30`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: BRAND_COLORS.primary,
                opacity: onlinePulse,
                boxShadow: `0 0 8px ${BRAND_COLORS.primary}`,
              }}
            />
            <span
              style={{
                fontSize: BRAND_FONTS.sizes.caption,
                fontFamily: BRAND_FONTS.family,
                fontWeight: BRAND_FONTS.weights.bold,
                color: BRAND_COLORS.primary,
              }}
            >
              2.3K online now
            </span>
          </div>
        </div>

        {/* Messages */}
        <div>
          {messages.map((msg, index) => (
            <Message key={index} {...msg} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
