import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BRAND_COLORS, BRAND_FONTS, ANIMATION_CONFIG } from '../constants/theme';

interface MessageBubbleProps {
  message: string;
  username?: string;
  isMention?: boolean;
  startFrame: number;
  x?: number;
  y?: number;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  username = 'User',
  isMention = false,
  startFrame,
  x = 100,
  y = 100,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = Math.max(0, frame - startFrame);

  // Spring animation for entrance
  const scale = spring({
    frame: relativeFrame,
    fps,
    config: ANIMATION_CONFIG.spring.default,
  });

  const opacity = spring({
    frame: relativeFrame,
    fps,
    config: ANIMATION_CONFIG.spring.smooth,
    from: 0,
    to: 1,
  });

  // Highlight mention text
  const renderMessage = () => {
    if (isMention && message.includes('@')) {
      const parts = message.split(/(@\w+)/g);
      return parts.map((part, index) =>
        part.startsWith('@') ? (
          <span
            key={index}
            style={{
              backgroundColor: BRAND_COLORS.primary,
              color: BRAND_COLORS.background,
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: BRAND_FONTS.weights.bold,
            }}
          >
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      );
    }
    return message;
  };

  if (relativeFrame < 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${scale})`,
        opacity,
        maxWidth: 600,
      }}
    >
      <div
        style={{
          backgroundColor: BRAND_COLORS.accent,
          padding: '16px 20px',
          borderRadius: '10px',
          border: `1px solid ${BRAND_COLORS.cardBorder}`,
        }}
      >
        <div
          style={{
            fontSize: BRAND_FONTS.sizes.caption,
            color: BRAND_COLORS.textMuted,
            marginBottom: '6px',
            fontFamily: BRAND_FONTS.family,
            fontWeight: BRAND_FONTS.weights.bold,
          }}
        >
          {username}
        </div>
        <div
          style={{
            fontSize: BRAND_FONTS.sizes.body,
            color: BRAND_COLORS.text,
            fontFamily: BRAND_FONTS.family,
            lineHeight: BRAND_FONTS.lineHeights.normal,
          }}
        >
          {renderMessage()}
        </div>
      </div>
    </div>
  );
};
