import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

/**
 * Scene 1: User Generates Roadmap in Chat
 * Shows chat interface with user asking to create a learning roadmap
 * Exact styling from mobile/components/Chat.tsx (white theme)
 */
export const Scene1_ChatGeneration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation: Slide in from bottom
  const slideUp = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
    },
  });

  const containerTranslateY = interpolate(slideUp, [0, 1], [100, 0]);
  const containerOpacity = interpolate(slideUp, [0, 1], [0, 1]);

  // Message bubble animation
  const messageOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const typingIndicatorOpacity = interpolate(frame, [50, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F9FBFC',
        padding: 60,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Mock Phone Container */}
      <div
        style={{
          width: 400,
          height: 800,
          backgroundColor: '#F9FBFC',
          borderRadius: 40,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          transform: `translateY(${containerTranslateY}px)`,
          opacity: containerOpacity,
        }}
      >
        {/* Top Nav - From Chat.tsx lines 556-625 */}
        <div
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 50,
            paddingBottom: 15,
            backgroundColor: '#F9FBFC',
            borderBottom: '1px solid #EDF3FC',
            borderRadius: 10,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* Menu Button */}
            <div
              style={{
                borderRadius: 50,
                border: '0.5px solid #EDF3FC',
                padding: 12,
                width: 50,
                height: 50,
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: 20, height: 20, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ width: '100%', height: 2, backgroundColor: '#2D3C52', borderRadius: 1 }} />
                <div style={{ width: '100%', height: 2, backgroundColor: '#2D3C52', borderRadius: 1 }} />
                <div style={{ width: '100%', height: 2, backgroundColor: '#2D3C52', borderRadius: 1 }} />
              </div>
            </div>
            <span
              style={{
                color: '#2D3C52',
                fontSize: 20,
                fontWeight: 500,
                fontFamily: 'Satoshi-Regular',
                lineHeight: '24px',
              }}
            >
              AI Tutor Chat
            </span>
          </div>
        </div>

        {/* Chat Content Area */}
        <div
          style={{
            flex: 1,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: 16,
          }}
        >
          {/* User Message - From MessageItem styling */}
          <div
            style={{
              opacity: messageOpacity,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                backgroundColor: '#000',
                borderRadius: 16,
                borderTopRightRadius: 4,
                padding: 12,
                maxWidth: '75%',
              }}
            >
              <p
                style={{
                  color: '#00FF80',
                  fontFamily: 'Satoshi-Regular',
                  fontSize: 14,
                  lineHeight: '20px',
                  margin: 0,
                }}
              >
                Create a learning roadmap for Web3 development
              </p>
            </div>
          </div>

          {/* AI Typing Indicator */}
          <div
            style={{
              opacity: typingIndicatorOpacity,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#F0F4FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#2D3C52',
                  borderRadius: 10,
                }}
              />
            </div>

            {/* Typing Bubble */}
            <div
              style={{
                backgroundColor: '#F0F4FF',
                borderRadius: 16,
                borderTopLeftRadius: 4,
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {/* Animated dots */}
              {[0, 1, 2].map((i) => {
                const dotOpacity = interpolate(
                  (frame + i * 5) % 30,
                  [0, 15, 30],
                  [0.3, 1, 0.3],
                );
                return (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#2D3C52',
                      opacity: dotOpacity,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Input Container - From Chat.tsx lines 881-914 */}
        <div
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 12,
            paddingBottom: 16,
            borderTop: '1px solid #EDF3FC',
            backgroundColor: '#FFFFFF',
          }}
        >
          <div
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F0F4FF',
              borderRadius: 24,
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 8,
              paddingBottom: 8,
              minHeight: 50,
              display: 'flex',
              gap: 8,
            }}
          >
            <div style={{ flex: 1, color: '#61728C', fontSize: 14 }}>Ask Eddie anything...</div>
            {/* Mic Icon */}
            <div style={{ width: 24, height: 24, backgroundColor: '#2D3C52', borderRadius: 12 }} />
            {/* Send Icon */}
            <div style={{ width: 24, height: 24, backgroundColor: '#2D3C52', borderRadius: 12 }} />
          </div>
        </div>
      </div>

      {/* Title Text */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [0, 20], [0, 1]),
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#2D3C52',
            margin: 0,
            fontFamily: 'Satoshi-Regular',
          }}
        >
          Generate Learning Roadmaps
        </h1>
        <p
          style={{
            fontSize: 20,
            color: '#61728C',
            margin: '10px 0 0 0',
            fontFamily: 'Satoshi-Regular',
          }}
        >
          Ask Eddie to create a personalized path
        </p>
      </div>
    </AbsoluteFill>
  );
};
