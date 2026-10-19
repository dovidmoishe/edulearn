import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { UserAvatar } from '../../components/UserAvatar';
import { MessageBubble } from '../../components/MessageBubble';
import { EmojiReaction } from '../../components/EmojiReaction';
import { BRAND_COLORS, BRAND_FONTS, ANIMATION_CONFIG } from '../../constants/theme';

const users = [
  { username: 'Alex', x: 150, y: 200 },
  { username: 'Sarah', x: 930, y: 200 },
  { username: 'Mike', x: 150, y: 880 },
  { username: 'Emma', x: 930, y: 880 },
  { username: 'James', x: 150, y: 540 },
  { username: 'Lisa', x: 930, y: 540 },
];

/**
 * Scene 3: Real-Time Chat Action (7-12s | Frames 210-360)
 * Corresponds to frames 0-150 in this scene
 * - 0-30: Chat interface expands from card
 * - 15-30: User avatars pop in around edges
 * - 30-60: First message appears with typing indicator
 * - 60-75: Emoji reactions float up
 * - 75-90: Second message with @mention
 * - 90-120: "2 users typing..." indicator
 * - 120-150: Online counter updates
 */
export const Scene3_Chat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Chat interface expansion (frames 0-30)
  const chatScale = spring({
    frame,
    fps,
    config: { ...ANIMATION_CONFIG.spring.default, damping: 20 },
  });

  const chatOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Typing indicator dots animation
  const typingDot1 = Math.sin((frame * 0.3) + 0) > 0 ? 1 : 0.3;
  const typingDot2 = Math.sin((frame * 0.3) + (Math.PI / 3)) > 0 ? 1 : 0.3;
  const typingDot3 = Math.sin((frame * 0.3) + (Math.PI * 2 / 3)) > 0 ? 1 : 0.3;

  // Online counter animation (frames 120-150)
  const onlineCount = Math.floor(
    interpolate(frame, [120, 150], [87, 120], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.ease),
    })
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND_COLORS.background,
      }}
    >
      {/* Chat container */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) scale(${chatScale})`,
          opacity: chatOpacity,
          width: 700,
          height: 500,
          backgroundColor: BRAND_COLORS.card,
          border: `2px solid ${BRAND_COLORS.cardBorder}`,
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Chat header */}
        <div
          style={{
            padding: '20px',
            borderBottom: `1px solid ${BRAND_COLORS.cardBorder}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: BRAND_FONTS.sizes.title,
              fontFamily: BRAND_FONTS.family,
              fontWeight: BRAND_FONTS.weights.bold,
              color: BRAND_COLORS.text,
            }}
          >
            Blockchain Builders
          </div>

          {/* Online counter (appears at frame 120) */}
          {frame >= 120 && (
            <div
              style={{
                backgroundColor: BRAND_COLORS.primary,
                color: BRAND_COLORS.background,
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: BRAND_FONTS.sizes.caption,
                fontFamily: BRAND_FONTS.family,
                fontWeight: BRAND_FONTS.weights.bold,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: BRAND_COLORS.background,
                }}
              />
              {onlineCount} online
            </div>
          )}
        </div>

        {/* Messages area */}
        <div style={{ padding: '20px', position: 'relative', height: 'calc(100% - 80px)' }}>
          {/* First message with typing indicator (frames 30-60) */}
          {frame >= 30 && frame < 45 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: BRAND_FONTS.sizes.caption,
                  color: BRAND_COLORS.textMuted,
                  fontFamily: BRAND_FONTS.family,
                  fontStyle: 'italic',
                }}
              >
                Alex is typing
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: BRAND_COLORS.primary,
                    opacity: typingDot1,
                  }}
                />
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: BRAND_COLORS.primary,
                    opacity: typingDot2,
                  }}
                />
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: BRAND_COLORS.primary,
                    opacity: typingDot3,
                  }}
                />
              </div>
            </div>
          )}

          {/* First message appears (frame 45) */}
          {frame >= 45 && (
            <MessageBubble
              message="Hey everyone! 👋"
              username="Alex"
              startFrame={45}
              x={0}
              y={0}
            />
          )}

          {/* Emoji reactions floating up (frames 60-90) */}
          {frame >= 60 && <EmojiReaction emoji="🔥" startX={100} startY={100} startFrame={60} duration={30} />}
          {frame >= 65 && <EmojiReaction emoji="💡" startX={150} startY={100} startFrame={65} duration={30} />}
          {frame >= 70 && <EmojiReaction emoji="👍" startX={200} startY={100} startFrame={70} duration={30} />}

          {/* Second message with mention (frame 75) */}
          {frame >= 75 && (
            <MessageBubble
              message="@alex thoughts on this?"
              username="Sarah"
              isMention={true}
              startFrame={75}
              x={0}
              y={120}
            />
          )}

          {/* Multiple users typing indicator (frames 90-120) */}
          {frame >= 90 && frame < 135 && (
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: BRAND_FONTS.sizes.caption,
                  color: BRAND_COLORS.textMuted,
                  fontFamily: BRAND_FONTS.family,
                  fontStyle: 'italic',
                }}
              >
                2 users typing...
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: BRAND_COLORS.primary,
                    opacity: typingDot1,
                  }}
                />
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: BRAND_COLORS.primary,
                    opacity: typingDot2,
                  }}
                />
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: BRAND_COLORS.primary,
                    opacity: typingDot3,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User avatars around the edges (frames 15-30) */}
      {users.map((user, index) => (
        <UserAvatar
          key={user.username}
          username={user.username}
          x={user.x}
          y={user.y}
          startFrame={15 + index * 3}
          isOnline={true}
          size={60}
        />
      ))}
    </AbsoluteFill>
  );
};
