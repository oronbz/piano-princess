# Piano Princess Quest

**Live:** [piano-princess.vercel.app](https://piano-princess.vercel.app)

A gamified piano practice tracker for kids, built as a Hebrew RTL progressive web app. Kids complete daily practice tasks, earn XP, level up, collect stickers, play a built-in touch piano, and get fun AI-generated challenges and stories.

## Features

- **Daily Tasks** — Customizable practice tasks that reset each day. Complete them all to earn bonus gems and extend your streak.
- **XP & Leveling** — Earn experience points for each task. Level up through 13 tiers with increasing thresholds.
- **Sticker Collection** — Unlock collectible stickers as you reach new levels.
- **Streak Tracking** — Maintain a daily practice streak by completing all tasks.
- **Touch Piano** — A 2-octave (C4–B5) playable piano with Web Audio synthesis, glissando support, and sparkle effects. Rotated for landscape play on portrait devices.
- **Fun Zone** — Random silly challenges ("play with your nose!") and short magical princess stories to keep practice playful.
- **Settings** — Add, edit, or remove task templates to personalize the daily routine.
- **PWA** — Installable on mobile with offline support via service worker caching.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** with HMR
- **Tailwind CSS 4**
- **vite-plugin-pwa** (Workbox) for offline/PWA support
- **Lucide React** icons
- **Web Audio API** for piano synthesis
- **localStorage** for persistence

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

## Deployment

This project auto-deploys to **Vercel** on every push to `main`.

Vercel project: [piano-princess](https://vercel.com/orons-projects-689b29e5/piano-princess)

## Project Structure

```
src/
├── components/     # Celebration, LevelUpModal, MagicModal
├── data/           # Constants (levels, stickers, default tasks)
├── hooks/          # useGameState, useMagicContent
├── layout/         # Header, BottomNav, StreakCard
├── lib/            # Sound effects
├── pages/          # TasksPage, StickersPage, FunPage, PianoPage, SettingsPage
├── types.ts        # TypeScript interfaces
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

## License

Private project.
