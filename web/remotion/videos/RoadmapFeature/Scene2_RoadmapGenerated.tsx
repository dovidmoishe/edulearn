import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

/**
 * Scene 2: Roadmap Being Generated
 * Shows AI generating a structured roadmap with steps
 * Styling from mobile app roadmap components
 */
export const Scene2_RoadmapGenerated: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance animation
  const cardSpring = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  const cardScale = interpolate(cardSpring, [0, 1], [0.9, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // Steps appear one by one
  const step1Opacity = interpolate(frame, [20, 30], [0, 1], { extrapolateRight: 'clamp' });
  const step2Opacity = interpolate(frame, [35, 45], [0, 1], { extrapolateRight: 'clamp' });
  const step3Opacity = interpolate(frame, [50, 60], [0, 1], { extrapolateRight: 'clamp' });
  const step4Opacity = interpolate(frame, [65, 75], [0, 1], { extrapolateRight: 'clamp' });

  // Shimmer effect for generating
  const shimmerX = interpolate(frame % 60, [0, 60], [-200, 800]);

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
          AI Creates Your Path
        </h1>
        <p
          style={{
            fontSize: 20,
            color: '#61728C',
            margin: '10px 0 0 0',
            fontFamily: 'Satoshi-Regular',
          }}
        >
          Structured learning steps generated instantly
        </p>
      </div>

      {/* Roadmap Card - Styled from mobile/app/roadmaps/[id].tsx */}
      <div
        style={{
          width: 500,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #EDF3FC',
          padding: 24,
          transform: `scale(${cardScale})`,
          opacity: cardOpacity,
          overflow: 'hidden',
        }}
      >
        {/* Roadmap Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* Roadmap Icon */}
          <div
            style={{
              width: 32,
              height: 32,
              backgroundColor: '#00FF80',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                border: '2px solid #000',
                borderRadius: 4,
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: '#2D3C52',
                margin: 0,
                fontFamily: 'Satoshi-Regular',
              }}
            >
              Web3 Development Learning Path
            </h3>
          </div>
        </div>

        {/* Roadmap Details - From roadmaps/[id].tsx lines 152-195 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1px solid #EDF3FC',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                fontSize: 13,
                fontWeight: 500,
                color: '#2D3C52',
                fontFamily: 'Satoshi-Regular',
              }}
            >
              45min
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                fontSize: 13,
                fontWeight: 500,
                color: '#2D3C52',
                fontFamily: 'Satoshi-Regular',
              }}
            >
              5 steps
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
                fontSize: 13,
                fontWeight: 500,
                color: '#2D3C52',
                fontFamily: 'Satoshi-Regular',
              }}
            >
              15 XP
            </span>
          </div>
        </div>

        {/* Roadmap Steps - From roadmaps/[id].tsx lines 211-264 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Step 1 */}
          <RoadmapStep
            number={1}
            title="Introduction to Blockchain"
            time="8min"
            opacity={step1Opacity}
          />

          {/* Step 2 */}
          <RoadmapStep
            number={2}
            title="Smart Contracts Basics"
            time="10min"
            opacity={step2Opacity}
          />

          {/* Step 3 */}
          <RoadmapStep
            number={3}
            title="Solidity Programming"
            time="12min"
            opacity={step3Opacity}
          />

          {/* Step 4 */}
          <RoadmapStep
            number={4}
            title="DApp Development"
            time="10min"
            opacity={step4Opacity}
          />
        </div>

        {/* Shimmer overlay for "generating" effect */}
        {frame < 70 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: shimmerX,
              width: 200,
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(0, 255, 128, 0.1), transparent)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Generating Label */}
      {frame < 70 && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            opacity: interpolate(frame, [0, 10], [0, 1]),
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: '#00FF80',
            }}
          />
          <span
            style={{
              fontSize: 16,
              color: '#61728C',
              fontFamily: 'Satoshi-Regular',
            }}
          >
            Generating your personalized learning path...
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Roadmap Step Component - Styled from roadmaps/[id].tsx lines 348-387
const RoadmapStep: React.FC<{
  number: number;
  title: string;
  time: string;
  opacity: number;
}> = ({ number, title, time, opacity }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        opacity,
      }}
    >
      {/* Step Number Badge */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: '#FFF',
            fontSize: 14,
            fontWeight: 600,
            fontFamily: 'Satoshi-Regular',
          }}
        >
          {number}
        </span>
      </div>

      {/* Step Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span
          style={{
            color: '#2D3C52',
            fontSize: 14,
            fontWeight: 500,
            fontFamily: 'Satoshi-Regular',
          }}
        >
          {title}
        </span>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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
              gap: 8,
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
                fontFamily: 'Satoshi-Regular',
              }}
            >
              Start
            </span>
          </div>

          {/* Time */}
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#61728C',
              fontFamily: 'Satoshi-Regular',
            }}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
};
