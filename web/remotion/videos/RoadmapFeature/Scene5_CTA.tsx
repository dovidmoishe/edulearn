import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';

/**
 * Scene 5: Call-to-Action
 * Final scene encouraging users to start their learning journey
 */
export const Scene5_CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text fade in
  const textOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Scale animation for emphasis
  const scale = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  const ctaScale = interpolate(scale, [0, 1], [0.9, 1]);

  // Pulsing effect on button
  const buttonPulse = Math.sin(frame * 0.15) * 0.05 + 1;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F9FBFC',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
      }}
    >
      {/* Background Accent */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 255, 128, 0.1) 0%, transparent 70%)',
          opacity: interpolate(frame, [0, 20], [0, 1]),
        }}
      />

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
          transform: `scale(${ctaScale})`,
          opacity: textOpacity,
          zIndex: 1,
        }}
      >
        {/* EduLearn Logo/Badge */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 30,
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: '#00FF80',
            }}
          />
        </div>

        {/* Heading */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#2D3C52',
              margin: 0,
              fontFamily: 'Satoshi-Regular',
              lineHeight: 1.2,
            }}
          >
            Start Your Learning Journey
          </h1>
          <p
            style={{
              fontSize: 24,
              color: '#61728C',
              margin: '20px 0 0 0',
              fontFamily: 'Satoshi-Regular',
              lineHeight: 1.5,
            }}
          >
            Generate personalized roadmaps powered by AI
          </p>
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          <FeaturePill icon="🎯" text="Structured Learning" delay={20} frame={frame} />
          <FeaturePill icon="🤖" text="AI-Powered" delay={25} frame={frame} />
          <FeaturePill icon="🏆" text="Earn XP & Badges" delay={30} frame={frame} />
        </div>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 20,
            transform: `scale(${buttonPulse})`,
          }}
        >
          <div
            style={{
              paddingLeft: 48,
              paddingRight: 48,
              paddingTop: 20,
              paddingBottom: 20,
              backgroundColor: '#000',
              borderRadius: 16,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: '#00FF80',
                fontFamily: 'Satoshi-Regular',
              }}
            >
              Get Started Free
            </span>
          </div>
        </div>

        {/* Bottom Text */}
        <p
          style={{
            fontSize: 16,
            color: '#61728C',
            margin: '20px 0 0 0',
            fontFamily: 'Satoshi-Regular',
            opacity: interpolate(frame, [40, 50], [0, 1]),
          }}
        >
          Join thousands of learners on EduLearn
        </p>
      </div>

      {/* Floating Elements */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 400;
        const x = Math.cos(angle + frame * 0.01) * radius;
        const y = Math.sin(angle + frame * 0.01) * radius;
        const floatOpacity = interpolate(frame, [10 + i * 3, 25 + i * 3], [0, 0.3]);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#00FF80',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              opacity: floatOpacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Feature Pill Component
const FeaturePill: React.FC<{
  icon: string;
  text: string;
  delay: number;
  frame: number;
}> = ({ icon, text, delay, frame }) => {
  const opacity = interpolate(frame, [delay, delay + 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(frame, [delay, delay + 10], [20, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        border: '1px solid #EDF3FC',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity,
        transform: `translateY(${translateY}px)`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: '#2D3C52',
          fontFamily: 'Satoshi-Regular',
        }}
      >
        {text}
      </span>
    </div>
  );
};
