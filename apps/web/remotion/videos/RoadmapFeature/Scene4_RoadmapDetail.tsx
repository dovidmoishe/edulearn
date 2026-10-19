import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

/**
 * Scene 4: Roadmap Detail View
 * Shows the full roadmap with all steps and interaction
 * Exact styling from mobile/app/roadmaps/[id].tsx
 */
export const Scene4_RoadmapDetail: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Page transition
  const slideIn = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
    },
  });

  const translateX = interpolate(slideIn, [0, 1], [100, 0]);
  const opacity = interpolate(slideIn, [0, 1], [0, 1]);

  // Progress bar animation
  const progress = interpolate(frame, [30, 70], [0, 0.6], {
    extrapolateRight: 'clamp',
  });

  // Step highlighting
  const highlightStep = Math.floor(interpolate(frame, [40, 100], [0, 4], {
    extrapolateRight: 'clamp',
  }));

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
          Track Your Progress
        </h1>
        <p
          style={{
            fontSize: 20,
            color: '#61728C',
            margin: '10px 0 0 0',
            fontFamily: 'Satoshi-Regular',
          }}
        >
          Complete steps and earn XP
        </p>
      </div>

      {/* Mock Phone Container - Roadmap Detail Screen */}
      <div
        style={{
          width: 420,
          height: 800,
          backgroundColor: '#F9FBFC',
          borderRadius: 40,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          transform: `translateX(${translateX}px)`,
          opacity,
        }}
      >
        {/* Top Nav - From roadmaps/[id].tsx lines 116-121 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 16,
            alignItems: 'center',
            marginTop: 50,
            paddingLeft: 24,
            paddingRight: 24,
            paddingBottom: 20,
          }}
        >
          {/* Back Button */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#FFF',
              border: '1px solid #EDF3FC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderLeft: '2px solid #2D3C52',
                borderBottom: '2px solid #2D3C52',
                transform: 'rotate(45deg)',
              }}
            />
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 500,
              fontFamily: 'Satoshi',
              color: '#2D3C52',
              lineHeight: '24px',
            }}
          >
            Learning Path
          </span>
        </div>

        {/* Scroll Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          {/* Roadmap Info Card - From roadmaps/[id].tsx lines 129-208 */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              borderWidth: 1,
              border: '1px solid #EDF3FC',
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginBottom: 16,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: '#00FF80',
                  borderRadius: 6,
                }}
              />
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  fontFamily: 'Satoshi',
                  color: '#2D3C52',
                  lineHeight: '26px',
                }}
              >
                Learning Path: Web3 Development
              </span>
            </div>

            {/* Details Row */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 16, height: 16, backgroundColor: '#61728C', borderRadius: 8 }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: '#2D3C52', fontFamily: 'Satoshi' }}>
                  45min
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 16, height: 16, backgroundColor: '#61728C', borderRadius: 8 }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: '#2D3C52', fontFamily: 'Satoshi' }}>
                  5 steps
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 16, height: 16, backgroundColor: '#00FF80', borderRadius: 8 }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: '#2D3C52', fontFamily: 'Satoshi' }}>
                  15xp
                </span>
              </div>
            </div>

            {/* Share Progress Button */}
            <div
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                paddingTop: 12,
                paddingBottom: 12,
                backgroundColor: '#FFF',
                borderRadius: 8,
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#000',
                  fontFamily: 'Satoshi',
                }}
              >
                Share Progress ({Math.round(progress * 100)}%)
              </span>
            </div>
          </div>

          {/* Roadmap Steps List - From roadmaps/[id].tsx lines 210-265 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              paddingBottom: 24,
            }}
          >
            {[
              { title: 'Introduction to Blockchain', desc: 'Learn the fundamentals of blockchain technology', time: '8min' },
              { title: 'Smart Contracts Basics', desc: 'Understanding smart contracts and their applications', time: '10min' },
              { title: 'Solidity Programming', desc: 'Master the Solidity programming language', time: '12min' },
              { title: 'DApp Development', desc: 'Build your first decentralized application', time: '10min' },
              { title: 'Web3 Integration', desc: 'Connect your DApp to Web3 providers', time: '5min' },
            ].map((step, index) => (
              <RoadmapStep
                key={index}
                number={index + 1}
                title={step.title}
                description={step.desc}
                time={step.time}
                completed={index < Math.floor(progress * 5)}
                highlighted={highlightStep === index}
              />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Roadmap Step Component - Styled from roadmaps/[id].tsx lines 212-264
const RoadmapStep: React.FC<{
  number: number;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  highlighted: boolean;
}> = ({ number, title, description, time, completed, highlighted }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: highlighted ? 'rgba(0, 255, 128, 0.05)' : 'transparent',
        padding: highlighted ? 8 : 0,
        borderRadius: 8,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Step Number Badge - From roadmaps/[id].tsx lines 213-215 */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: completed ? '#00FF80' : '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {completed ? (
          <div
            style={{
              width: 12,
              height: 8,
              borderLeft: '2px solid #000',
              borderBottom: '2px solid #000',
              transform: 'rotate(-45deg) translateY(-2px)',
            }}
          />
        ) : (
          <span style={{ color: '#FFF', fontSize: 14, fontWeight: 600 }}>{number}</span>
        )}
      </div>

      {/* Step Content - From roadmaps/[id].tsx lines 217-261 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span
          style={{
            color: '#2D3C52',
            fontSize: 14,
            fontWeight: 500,
            fontFamily: 'Satoshi',
            lineHeight: '20px',
            textDecoration: completed ? 'line-through' : 'none',
            opacity: completed ? 0.6 : 1,
          }}
        >
          {title}
        </span>
        <span
          style={{
            color: '#61728C',
            fontSize: 13,
            fontWeight: 400,
            fontFamily: 'Satoshi',
            lineHeight: '20px',
            textDecoration: completed ? 'line-through' : 'none',
            opacity: completed ? 0.6 : 1,
          }}
        >
          {description}
        </span>

        {/* Footer with button and time */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            marginTop: 4,
          }}
        >
          {/* Start Button */}
          <div
            style={{
              paddingLeft: 16,
              paddingRight: 16,
              paddingTop: 8,
              paddingBottom: 8,
              backgroundColor: '#FFF',
              borderRadius: 8,
              border: '1px solid #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: completed ? 0.5 : 1,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: '#000',
                clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#000',
                fontFamily: 'Satoshi',
                lineHeight: '20px',
              }}
            >
              {completed ? 'Done' : 'Start'}
            </span>
          </div>

          {/* Time */}
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#61728C',
              fontFamily: 'Satoshi',
              lineHeight: '20px',
            }}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};
