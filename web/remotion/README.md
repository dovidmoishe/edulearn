# EduLearn Community Feature Animation

A 15-second Remotion animation showcasing the EduLearn community feature, optimized for social media marketing.

## Overview

This animation demonstrates:
- **Scene 1 (0-3s)**: Logo materialization with lime green particles
- **Scene 2 (3-7s)**: Three community cards with member counts
- **Scene 3 (7-12s)**: Real-time chat with typing indicators, emoji reactions, and @mentions
- **Scene 4 (12-15s)**: Call-to-action button with particle burst

## Quick Start

### Development Preview

```bash
cd web
npm run remotion:dev
```

This opens Remotion Studio at `http://localhost:3000` where you can:
- Preview the animation in real-time
- Scrub through the timeline
- Adjust timing and animations
- Export individual frames

### Rendering

**Square Format (1:1) for Instagram/Twitter**
```bash
cd web
npx remotion render CommunityIntro out/community-intro.mp4 \
  --codec h264 \
  --crf 18 \
  --width 1080 \
  --height 1080
```

**Vertical Format (9:16) for Instagram Stories/TikTok**
```bash
npx remotion render CommunityIntro out/community-intro-story.mp4 \
  --codec h264 \
  --crf 18 \
  --width 1080 \
  --height 1920
```

**Horizontal Format (16:9) for YouTube**
```bash
npx remotion render CommunityIntro out/community-intro-youtube.mp4 \
  --codec h264 \
  --crf 18 \
  --width 1920 \
  --height 1080
```

## File Structure

```
remotion/
├── Root.tsx                          # Composition registry
├── index.ts                          # Entry point
├── constants/
│   └── theme.ts                      # Brand colors & fonts
├── components/
│   ├── ParticleGlow.tsx              # Lime green particle effects
│   ├── MessageBubble.tsx             # Chat message component
│   ├── UserAvatar.tsx                # Animated user avatars
│   ├── EmojiReaction.tsx             # Floating emoji reactions
│   └── BrandLogo.tsx                 # EduLearn logo with glow
└── videos/
    └── CommunityIntro/
        ├── index.tsx                 # Main composition
        ├── Scene1_Hook.tsx           # 0-3s: Logo animation
        ├── Scene2_Communities.tsx    # 3-7s: Community cards
        ├── Scene3_Chat.tsx           # 7-12s: Real-time chat
        └── Scene4_CTA.tsx            # 12-15s: Call-to-action
```

## Customization

### Changing Colors

Edit `remotion/constants/theme.ts`:
```typescript
export const BRAND_COLORS = {
  primary: '#00FF80',       // Change lime green
  background: '#0D0D0D',    // Change background
  // ...
};
```

### Adjusting Timing

Edit `remotion/constants/theme.ts`:
```typescript
export const ANIMATION_CONFIG = {
  duration: {
    scene1: 90,  // 3 seconds at 30fps
    scene2: 120, // 4 seconds
    scene3: 150, // 5 seconds
    scene4: 90,  // 3 seconds
  },
};
```

### Modifying Community Cards

Edit `remotion/videos/CommunityIntro/Scene2_Communities.tsx`:
```typescript
const communities = [
  { title: 'Your Community 1', members: '1.2K', index: 0 },
  { title: 'Your Community 2', members: '2.3K', index: 1 },
  { title: 'Your Community 3', members: '856', index: 2 },
];
```

### Changing Messages

Edit `remotion/videos/CommunityIntro/Scene3_Chat.tsx`:
- Line ~120: First message
- Line ~145: Second message with mention

## Tips & Best Practices

1. **Preview Often**: Use `npm run remotion:dev` to see changes in real-time
2. **Optimize Performance**: Keep particle counts reasonable (50-100 max)
3. **File Size**: Use CRF 18-20 for good quality at reasonable size
4. **Social Media**: Test uploads on target platforms before campaigns
5. **A/B Testing**: Try different CTAs or timing variations

## Render Settings Explained

- `--codec h264`: Video codec (widely supported)
- `--crf 18`: Quality level (lower = better quality, bigger file)
- `--width/--height`: Output dimensions
- `--preset fast`: Encoding speed vs compression

## Troubleshooting

### Issue: "Cannot find module '@remotion/core'"
**Solution**: Run `npm install` in the web directory

### Issue: Slow rendering
**Solution**: Reduce particle counts or use `--preset ultrafast`

### Issue: Logo not appearing
**Solution**: Ensure `/public/assets/icons/LOGO1.png` exists

### Issue: Font not loading
**Solution**: Check that Satoshi font is in `/public/assets/fonts/`

## Social Media Specifications

| Platform | Aspect Ratio | Recommended Size | Max Duration |
|----------|--------------|------------------|--------------|
| Twitter  | 1:1 or 16:9  | 1080x1080        | 2:20         |
| Instagram Feed | 1:1    | 1080x1080        | 60s          |
| Instagram Stories | 9:16 | 1080x1920       | 15s          |
| TikTok   | 9:16         | 1080x1920        | 60s          |
| LinkedIn | 1:1 or 16:9  | 1080x1080        | 10min        |

## Next Steps

1. **Render the animation** using one of the commands above
2. **Test on social platforms** to verify quality and autoplay
3. **Create variations** with different CTAs or messages
4. **Track performance** across different platforms

## Support

For issues or questions:
- Remotion Docs: https://www.remotion.dev/docs
- EduLearn Team: @edulearndotfun on Twitter

---

**Created with Remotion 4.0** | **Brand: EduLearn** | **Duration: 15s** | **FPS: 30**
