import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1_ChatGeneration } from './Scene1_ChatGeneration';
import { Scene2_RoadmapGenerated } from './Scene2_RoadmapGenerated';
import { Scene3_ProfileView } from './Scene3_ProfileView';
import { Scene4_RoadmapDetail } from './Scene4_RoadmapDetail';
import { Scene5_CTA } from './Scene5_CTA';

/**
 * Main RoadmapFeature Composition
 * 15-second animation showcasing the complete roadmap feature flow
 *
 * Scene Timeline:
 * - Scene 1 (0-90 frames / 0-3s): User generates roadmap in chat
 * - Scene 2 (90-180 frames / 3-6s): Roadmap being generated with AI
 * - Scene 3 (180-270 frames / 6-9s): Roadmap visible in profile
 * - Scene 4 (270-390 frames / 9-13s): Roadmap detail with steps
 * - Scene 5 (390-450 frames / 13-15s): Call-to-action
 */
export const RoadmapFeature: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#F9FBFC', // White theme background
        fontFamily: 'Satoshi, sans-serif',
      }}
    >
      {/* Scene 1: Chat Generation (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1_ChatGeneration />
      </Sequence>

      {/* Scene 2: Roadmap Being Generated (3-6s) */}
      <Sequence from={90} durationInFrames={90}>
        <Scene2_RoadmapGenerated />
      </Sequence>

      {/* Scene 3: Profile View (6-9s) */}
      <Sequence from={180} durationInFrames={90}>
        <Scene3_ProfileView />
      </Sequence>

      {/* Scene 4: Roadmap Detail (9-13s) */}
      <Sequence from={270} durationInFrames={120}>
        <Scene4_RoadmapDetail />
      </Sequence>

      {/* Scene 5: Call-to-Action (13-15s) */}
      <Sequence from={390} durationInFrames={60}>
        <Scene5_CTA />
      </Sequence>
    </AbsoluteFill>
  );
};
