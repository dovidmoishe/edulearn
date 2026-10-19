import React from 'react';
import { Composition } from 'remotion';
import { CommunityIntro } from './videos/CommunityIntro';
import { RoadmapFeature } from './videos/RoadmapFeature';
import { VIDEO_CONFIG } from './constants/theme';

const TestComponent: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#00FF80',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 48,
      color: '#000',
    }}>
      Test Works!
    </div>
  );
};

/**
 * Remotion Root Component
 * Registers all video compositions
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Test"
        component={TestComponent}
        durationInFrames={30}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="CommunityIntro"
        component={CommunityIntro}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="RoadmapFeature"
        component={RoadmapFeature}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
