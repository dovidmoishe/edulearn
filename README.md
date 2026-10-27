# EduLearn

**Learn Web3 smarter. Earn as you go.**

EduLearn is an incentivized Web3 AI study companion. Chat with an AI tutor, take quizzes, earn XP and NFTs, and track your progress — on the web or on your phone.

[edulearn.fun](https://www.edulearn.fun)

## How it works

1. **Chat to learn** — Ask questions, get explanations, or explore a topic with your AI tutor.
2. **Take quizzes** — Short, fun quizzes that match your learning path.
3. **Earn as you go** — XP for correct answers, plus NFTs as proof of progress.
4. **Climb the leaderboard** — Friendly competition to keep you coming back.

You can also build your own learning roadmaps and see streaks, quiz history, and rewards on your profile.

## What you get

- AI tutor that explains things simply
- Interactive quizzes
- XP, badges, and NFT rewards
- Leaderboards
- Progress tracking
- Web and mobile, so you can learn anywhere

EduLearn has a free plan for core learning, and a premium plan for higher usage and more advanced AI models.

## Run it locally

You need **Node.js 24** and **pnpm 11.22**.

```sh
pnpm install --frozen-lockfile
```

Copy the example env files and fill in your values:

- `apps/api/.env.example` → `apps/api/.env`
- `apps/admin/.env.example` → `apps/admin/.env.local`
- `apps/mobile/.env.example` → `apps/mobile/.env`

Then start what you need:

```sh
pnpm dev:web       # student app — http://localhost:3000
pnpm dev:api       # API — http://localhost:3001
pnpm dev:admin     # admin — http://localhost:3002
pnpm dev:mobile    # Expo / mobile
```

## What's in this repo

```text
apps/web      Student website and learning app
apps/admin    Admin dashboard
apps/api      Backend
apps/mobile   Mobile app
```

## Links

- Website: [edulearn.fun](https://www.edulearn.fun)
- Support: [support.edulearn.fun](https://support.edulearn.fun)
