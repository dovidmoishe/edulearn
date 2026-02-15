import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { BRAND_COLORS } from '../constants/theme';

interface EmojiReactionProps {
  emoji: string;
  startX: number;
  startY: number;
  startFrame: number;
  duration?: number;
}

export const EmojiReaction: React.FC<EmojiReactionProps> = ({
  emoji,
  startX,
  startY,
  startFrame,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const relativeFrame = Math.max(0, frame - startFrame);

  // Float upward animation
  const progress = interpolate(relativeFrame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const y = startY - progress * 100; // Float up 100px
  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = interpolate(progress, [0, 0.3, 1], [0.5, 1.2, 0.8]);

  // Slight side-to-side wobble
  const wobble = Math.sin(relativeFrame * 0.2) * 10;

  if (relativeFrame < 0 || progress >= 1) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: startX + wobble,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        fontSize: 32,
        filter: `drop-shadow(0 0 8px ${BRAND_COLORS.primary})`,
        pointerEvents: 'none',
      }}
    >
      {emoji}
    </div>
  );
};
