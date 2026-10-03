import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

/**
 * Scene 3: Roadmap in Profile View
 * Shows the roadmap card as it appears in the profile
 * Exact styling from mobile/app/(tabs)/profile.tsx lines 435-504
 */
export const Scene3_ProfileView: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scroll animation - scrolling down to roadmap section
  const scrollY = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 20,
      stiffness: 80,
    },
  });

  const translateY = interpolate(scrollY, [0, 1], [200, 0]);
  const opacity = interpolate(scrollY, [0, 1], [0, 1]);

  // Card hover/tap effect
  const cardScale = interpolate(frame, [40, 45, 75, 80], [1, 1.02, 1.02, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F9FBFC',
        padding: 60,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(frame, [0, 15], [0, 1]),
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
          Access From Your Profile
        </h1>
        <p
          style={{
            fontSize: 20,
            color: '#61728C',
            margin: '10px 0 0 0',
            fontFamily: 'Satoshi-Regular',
          }}
        >
          View all your learning paths in one place
        </p>
      </div>

      {/* Mock Profile Screen */}
      <div
        style={{
          width: 420,
          height: 650,
          backgroundColor: '#F9FBFC',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          transform: `translateY(${translateY}px)`,
          opacity,
        }}
      >
        {/* Profile Header */}
        <div
          style={{
            padding: 20,
            borderBottom: '1px solid #EDF3FC',
            backgroundColor: '#F9FBFC',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: '#2D3C52',
                margin: 0,
                fontFamily: 'Urbanist',
              }}
            >
              Profile
            </h2>
            <div
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#FFF',
                borderRadius: 20,
                border: '0.5px solid #EDF3FC',
              }}
            />
          </div>
        </div>

        {/* Scroll Content */}
        <div style={{ padding: 20 }}>
          {/* "Your Learning Paths" Section Title - From profile.tsx lines 437-439 */}
          <h3
            style={{
              fontFamily: 'Satoshi-Regular',
              fontSize: 18,
              fontWeight: 600,
              color: '#2D3C52',
              margin: '20px 0 16px 0',
            }}
          >
            Your Learning Paths
          </h3>

          {/* Roadmap Card - From profile.tsx lines 445-501 */}
          <div
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#EDF3FC',
              border: '1px solid #EDF3FC',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              transform: `scale(${cardScale})`,
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
            }}
          >
            {/* Card Header */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              {/* Roadmap Icon */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: '#00FF80',
                    borderRadius: 6,
                  }}
                />
              </div>

              {/* Title */}
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontFamily: 'Satoshi-Regular',
                    fontSize: 16,
                    fontWeight: 600,
                    color: '#2D3C52',
                    lineHeight: '22px',
                  }}
                >
                  Web3 Development Learning Path
                </span>
              </div>
            </div>

            {/* Stats Row - From profile.tsx lines 461-491 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                {/* Time Stat */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: '#61728C',
                      borderRadius: 8,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Satoshi-Regular',
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#61728C',
                      lineHeight: '18px',
                    }}
                  >
                    ~45 mins
                  </span>
                </div>

                {/* Steps Stat */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: '#61728C',
                      borderRadius: 8,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'Satoshi-Regular',
                      fontSize: 14,
                      fontWeight: 400,
                      color: '#61728C',
                      lineHeight: '18px',
                    }}
                  >
                    5 Steps
                  </span>
                </div>
              </div>

              {/* XP Stat */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: '#00FF80',
                    borderRadius: 8,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'Satoshi-Regular',
                    fontSize: 14,
                    fontWeight: 400,
                    color: '#61728C',
                    lineHeight: '18px',
                  }}
                >
                  Earn up to 16 XP
                </span>
              </div>
            </div>

            {/* View Button - From profile.tsx lines 493-500 */}
            <div
              style={{
                backgroundColor: '#000',
                borderRadius: 12,
                paddingTop: 14,
                paddingBottom: 14,
                paddingLeft: 20,
                paddingRight: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Satoshi-Regular',
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#00FF80',
                  lineHeight: '20px',
                }}
              >
                View Learning Path
              </span>
            </div>
          </div>

          {/* Second Roadmap Card (Placeholder) */}
          <div
            style={{
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #EDF3FC',
              padding: 16,
              marginTop: 16,
              opacity: 0.5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#F0F4FF',
                  borderRadius: 6,
                }}
              />
              <span
                style={{
                  fontFamily: 'Satoshi-Regular',
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#2D3C52',
                }}
              >
                DeFi Essentials
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tap/Click Indicator */}
      {frame >= 40 && frame <= 50 && (
        <div
          style={{
            position: 'absolute',
            bottom: 150,
            right: 350,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(0, 255, 128, 0.3)',
            border: '2px solid #00FF80',
            transform: `scale(${interpolate(frame, [40, 50], [0.5, 1.5])})`,
            opacity: interpolate(frame, [40, 50], [1, 0]),
          }}
        />
      )}
    </AbsoluteFill>
  );
};
