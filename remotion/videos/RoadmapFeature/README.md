# RoadmapFeature Motion Design

A 15-second Remotion video showcasing EduLearn's roadmap feature with exact styling from the mobile app (white theme).

## Overview

This motion design demonstrates the complete user journey for the roadmap feature:
1. **Chat Generation** - User asks Eddie AI to create a learning roadmap
2. **AI Generation** - Roadmap is generated with structured steps
3. **Profile View** - Roadmap appears in user's profile
4. **Detail View** - Full roadmap with interactive steps
5. **Call-to-Action** - Encouraging users to start their journey

## Video Specifications

- **Duration**: 15 seconds (450 frames)
- **Frame Rate**: 30 FPS
- **Resolution**: 1080x1080 (Square format for social media)
- **Theme**: White/Light theme matching mobile app

## Scene Breakdown

### Scene 1: Chat Generation (0-3s, Frames 0-90)
**File**: `Scene1_ChatGeneration.tsx`

Shows the chat interface where users generate roadmaps:
- Mock iPhone container with exact Chat.tsx styling
- Top navigation bar with menu button and "AI Tutor Chat" title
- User message bubble: "Create a learning roadmap for Web3 development"
- AI typing indicator with animated dots
- Input container at bottom with "Ask Eddie anything..." placeholder

**Styling References**:
- `mobile/components/Chat.tsx` lines 556-625 (Top Nav)
- `mobile/components/Chat.tsx` lines 881-914 (Input Container)
- `mobile/components/MessageItem.tsx` (Message bubbles)

**Animations**:
- Slide up entrance with spring physics
- Message fade in at frame 20-35
- Typing indicator at frame 50-65
- Animated typing dots cycling

### Scene 2: Roadmap Being Generated (3-6s, Frames 90-180)
**File**: `Scene2_RoadmapGenerated.tsx`

Displays AI generating the roadmap with shimmer effect:
- Roadmap card with header icon and title
- Stats row: duration (45min), steps (5), XP reward (15)
- Four learning steps appearing sequentially:
  1. Introduction to Blockchain (8min)
  2. Smart Contracts Basics (10min)
  3. Solidity Programming (12min)
  4. DApp Development (10min)
- Shimmer overlay for "generating" effect
- "Generating your personalized learning path..." label

**Styling References**:
- `mobile/app/roadmaps/[id].tsx` lines 296-305 (Roadmap Info Card)
- `mobile/app/roadmaps/[id].tsx` lines 326-341 (Details Row)
- `mobile/app/roadmaps/[id].tsx` lines 348-387 (Step Component)

**Animations**:
- Card scale and fade entrance
- Steps appear one by one (frames 20, 35, 50, 65)
- Shimmer effect moving left to right
- Label fade out at frame 70

### Scene 3: Profile View (6-9s, Frames 180-270)
**File**: `Scene3_ProfileView.tsx`

Shows the roadmap card in the user's profile:
- Profile screen header with "Profile" title and settings icon
- "Your Learning Paths" section title
- Roadmap card with:
  - Roadmap icon and title
  - Stats: ~45 mins, 5 Steps, Earn up to 16 XP
  - "View Learning Path" button in black with lime text
- Second placeholder roadmap card (DeFi Essentials)
- Tap indicator showing interaction

**Styling References**:
- `mobile/app/(tabs)/profile.tsx` lines 437-439 (Section Title)
- `mobile/app/(tabs)/profile.tsx` lines 445-501 (Roadmap Card)
- Exact colors: Background #F9FBFC, Card #FFFFFF, Border #EDF3FC

**Animations**:
- Scroll down effect revealing section
- Card scale on tap (frames 40-80)
- Tap indicator ripple effect

### Scene 4: Roadmap Detail (9-13s, Frames 270-390)
**File**: `Scene4_RoadmapDetail.tsx`

Full roadmap detail screen with all steps:
- Back button and "Learning Path" title
- Roadmap info card with stats and "Share Progress" button
- Complete list of 5 steps:
  1. Introduction to Blockchain
  2. Smart Contracts Basics
  3. Solidity Programming
  4. DApp Development
  5. Web3 Integration
- Progress bar animation showing 60% completion
- First 3 steps marked as completed with checkmarks
- Each step shows title, description, time, and Start/Done button

**Styling References**:
- `mobile/app/roadmaps/[id].tsx` lines 116-121 (Top Nav)
- `mobile/app/roadmaps/[id].tsx` lines 129-208 (Info Card)
- `mobile/app/roadmaps/[id].tsx` lines 212-264 (Step List)
- `mobile/app/roadmaps/[id].tsx` lines 348-387 (Step Component)

**Animations**:
- Slide in from right
- Progress bar fills from 0% to 60%
- Steps highlight sequentially
- Completed steps show checkmark and line-through

**Key Colors**:
- Background: #F9FBFC
- Cards: #FFFFFF with #EDF3FC border
- Text Primary: #2D3C52
- Text Secondary: #61728C
- Accent: #00FF80
- Button: #000 with #00FF80 text
- Completed: #00FF80 background

### Scene 5: Call-to-Action (13-15s, Frames 390-450)
**File**: `Scene5_CTA.tsx`

Final encouraging screen with CTA:
- Radial gradient background accent
- EduLearn logo badge (120x120)
- Heading: "Start Your Learning Journey"
- Subheading: "Generate personalized roadmaps powered by AI"
- Feature pills with icons:
  - 🎯 Structured Learning
  - 🤖 AI-Powered
  - 🏆 Earn XP & Badges
- "Get Started Free" button with pulse animation
- "Join thousands of learners on EduLearn" text
- 6 floating accent dots orbiting

**Animations**:
- Text fade in and scale up
- Feature pills appear with stagger (20ms, 25ms, 30ms)
- Button pulse effect
- Floating dots orbital animation

## Color Palette (White Theme)

```javascript
// Backgrounds
background: '#F9FBFC'      // Page background
card: '#FFFFFF'            // Card background
cardBorder: '#EDF3FC'      // Card borders

// Text
textPrimary: '#2D3C52'     // Main text
textSecondary: '#61728C'   // Secondary text
textMuted: '#B3B3B3'       // Muted text (dark theme only)

// Brand
primary: '#00FF80'         // Lime green accent
primaryForeground: '#000'  // Black on lime
accent: '#000'             // Black accents

// Interactive
buttonBg: '#000'           // Button background
buttonText: '#00FF80'      // Button text
```

## Typography

**Font Family**: Satoshi-Regular (fallback: sans-serif)

**Font Sizes**:
- Hero: 48-56px
- Title: 20px
- Body: 14-16px
- Caption: 12-13px

**Font Weights**:
- Regular: 400
- Medium: 500
- Semi-bold: 600
- Bold: 700

## Animation Configuration

**Spring Physics** (default):
```javascript
{
  damping: 12-15,
  stiffness: 100,
  mass: 0.8
}
```

**Timing**:
- Scene transitions: 10 frame overlap for smooth flow
- Text fades: 10-15 frames
- Element entrances: 15-20 frames
- Button interactions: 5-10 frames

## Running the Video

### Preview in Remotion Studio
```bash
cd web
npm run remotion:preview
```

Then select "RoadmapFeature" from the composition dropdown.

### Render Video
```bash
cd web
npm run remotion:render RoadmapFeature output.mp4
```

### Render with Custom Settings
```bash
npx remotion render RoadmapFeature output.mp4 \
  --codec=h264 \
  --crf=18 \
  --overwrite
```

## File Structure

```
RoadmapFeature/
├── index.tsx                    # Main composition with scene sequences
├── Scene1_ChatGeneration.tsx    # Chat interface (0-3s)
├── Scene2_RoadmapGenerated.tsx  # AI generation (3-6s)
├── Scene3_ProfileView.tsx       # Profile view (6-9s)
├── Scene4_RoadmapDetail.tsx     # Detail screen (9-13s)
├── Scene5_CTA.tsx               # Call-to-action (13-15s)
└── README.md                    # This file
```

## Component Reusability

Each scene is self-contained and can be used independently:

```typescript
// Use individual scene
import { Scene1_ChatGeneration } from './Scene1_ChatGeneration';

<Sequence from={0} durationInFrames={90}>
  <Scene1_ChatGeneration />
</Sequence>
```

## Customization

### Change Duration
Edit `index.tsx`:
```typescript
// Make scene longer
<Sequence from={0} durationInFrames={120}> // 4 seconds instead of 3
  <Scene1_ChatGeneration />
</Sequence>
```

### Adjust Animations
Each scene file contains frame-based animations using `interpolate`:
```typescript
const opacity = interpolate(frame, [20, 35], [0, 1]);
// Adjust frame numbers [20, 35] to change timing
```

### Modify Styling
All styling is inline and follows the mobile app exactly. Update values directly in JSX:
```typescript
style={{
  backgroundColor: '#F9FBFC', // Change colors here
  fontSize: 20,               // Adjust sizes
  fontWeight: 500,            // Change weights
}}
```

## Best Practices

1. **Maintain Exact Styling**: All components use exact values from mobile app
2. **Smooth Transitions**: 10-frame overlaps between scenes for seamless flow
3. **Responsive Animations**: Use `spring()` for physics-based motion
4. **Performance**: Avoid heavy computations in render loop
5. **Readability**: Keep scene files focused and well-commented

## Mobile App References

This video replicates styling from:
- `mobile/components/Chat.tsx` - Chat interface
- `mobile/app/(tabs)/profile.tsx` - Profile view
- `mobile/app/roadmaps/[id].tsx` - Roadmap detail
- `mobile/interface/Roadmap.ts` - Type definitions

All measurements, colors, typography, and layouts match exactly.

## Technical Notes

- **Frame Rate**: 30 FPS for smooth social media playback
- **Format**: Square (1080x1080) optimized for Instagram/Twitter
- **Theme**: White/Light theme only (not dark theme)
- **Font Loading**: Ensure Satoshi font is loaded in web project
- **Performance**: Each scene optimized to render quickly

## Future Enhancements

Potential additions:
- Dark theme variant
- 16:9 landscape version
- Shorter 10-second cut
- Alternative language versions
- Interactive web demo

## Credits

**Design**: Based on EduLearn mobile app design system
**Development**: Remotion v4.0+
**Framework**: React + TypeScript
**Animation**: Remotion spring physics and interpolation

---

For questions or modifications, refer to the main mobile app components or contact the development team.
