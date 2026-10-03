# EduLearn Mobile

EduLearn Mobile is the React Native app for EduLearn, built with Expo and Expo Router.
It includes AI tutor chat, quizzes, flashcards, roadmaps, rewards, community, referrals,
and user progression features.

## EduLearn Workspace

- API: [../edulearnapi](../edulearnapi)
- Web: [../web](../web)
- Workspace setup and commands: [../README.md](../README.md)

## Tech Stack

- Expo SDK 55
- React Native 0.83 / React 19
- Expo Router (file-based routing)
- Zustand (state management)
- Supabase JS client
- Socket.IO client

## Core App Areas

- Authentication and onboarding
- AI chat and agent flows
- Quizzes and quiz leaderboard
- Flashcards
- Roadmaps and activity tracking
- Rewards and streaks
- Community hub
- Referrals
- Notifications
- Wallet and subscription screens

## Prerequisites

- Node.js 24
- pnpm 11.22.0
- Expo CLI via `pnpm exec expo` inside `mobile/`

## Getting Started

1. Install dependencies from the repository root:

   ```bash
   pnpm install --frozen-lockfile
   ```

2. From `mobile/`, create your local environment file:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Set the required values in `.env`:

   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON`
   - `EXPO_PUBLIC_API_BASE_URL`
   - `EXPO_PUBLIC_TWITTER_CLIENT_ID`

4. Start the app:

   ```bash
   pnpm start
   ```

5. Run on a target platform from the Expo prompt (or use scripts below).

## Scripts

- `pnpm start` - start Expo dev server
- `pnpm android` - run Android build
- `pnpm ios` - run iOS build
- `pnpm web` - run web target
- `pnpm lint` - run lint checks
- `pnpm typecheck` - check TypeScript

These commands run inside `mobile/`. From the root, use `pnpm dev:mobile` or
`pnpm --filter mobile <script>`. Clear Metro once after migration with
`pnpm dev:mobile --clear`.

## Project Structure

- `app/` - routes and screens (Expo Router)
- `components/` - reusable UI components
- `core/` - Zustand stores and state
- `services/` - API/service layer
- `utils/` - helpers, constants, routing utilities
- `assets/` - fonts, images, animations

## Notes

- This app reads backend and auth configuration from `app.config.js` and `.env`.
- Keep secrets out of version control. Client-exposed values should use `EXPO_PUBLIC_*`.
