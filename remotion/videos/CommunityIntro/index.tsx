import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1_Hook } from './Scene1_Hook';
import { Scene2_Communities } from './Scene2_Communities';
import { Scene4_CTA } from './Scene4_CTA';
import { BRAND_COLORS } from '../../constants/theme';

/**
 * Main CommunityIntro Composition - Minimalist Redesign
 * 10-second clean animation showcasing EduLearn communities
 *
 * Scene Timeline:
 * - Scene 1 (0-90 frames / 0-3s): Hero text "Learn Together"
 * - Scene 2 (90-240 frames / 3-8s): Clean chat interface
 * - Scene 3 (240-300 frames / 8-10s): Call-to-action
 */
export const CommunityIntro: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND_COLORS.background,
        fontFamily: 'Satoshi, sans-serif',
      }}
    >
      {/* Scene 1: Hero Message (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1_Hook />
      </Sequence>

      {/* Scene 2: Community Chat (3-8s) */}
      <Sequence from={90} durationInFrames={150}>
        <Scene2_Communities />
      </Sequence>

      {/* Scene 3: Call-to-Action (8-10s) */}
      <Sequence from={240} durationInFrames={60}>
        <Scene4_CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
