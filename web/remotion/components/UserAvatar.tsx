import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BRAND_COLORS, BRAND_FONTS, ANIMATION_CONFIG } from '../constants/theme';

interface UserAvatarProps {
  username: string;
  x: number;
  y: number;
  startFrame: number;
  isOnline?: boolean;
  size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  x,
  y,
  startFrame,
  isOnline = true,
  size = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relativeFrame = Math.max(0, frame - startFrame);

  // Spring animation for pop-in effect
  const scale = spring({
    frame: relativeFrame,
    fps,
    config: ANIMATION_CONFIG.spring.bouncy,
  });

  const opacity = spring({
    frame: relativeFrame,
    fps,
    config: ANIMATION_CONFIG.spring.smooth,
    from: 0,
    to: 1,
  });

  if (relativeFrame < 0) return null;

  // Generate color based on username
  const avatarColor = `hsl(${(username.charCodeAt(0) * 13) % 360}, 70%, 50%)`;

  // Get initials
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    >
      {/* Avatar circle */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: avatarColor,
          border: `3px solid ${isOnline ? BRAND_COLORS.primary : BRAND_COLORS.cardBorder}`,
          boxShadow: isOnline ? `0 0 20px ${BRAND_COLORS.primary}` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: BRAND_FONTS.family,
          fontSize: size / 2.5,
          fontWeight: BRAND_FONTS.weights.bold,
          color: BRAND_COLORS.text,
        }}
      >
        {initials}
      </div>

      {/* Online status dot */}
      {isOnline && (
        <div
          style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: size / 5,
            height: size / 5,
            borderRadius: '50%',
            backgroundColor: BRAND_COLORS.primary,
            border: `2px solid ${BRAND_COLORS.background}`,
            boxShadow: `0 0 10px ${BRAND_COLORS.primary}`,
          }}
        />
      )}
    </div>
  );
};
