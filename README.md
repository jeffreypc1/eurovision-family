# Eurovision Family Ranker

A fun family website to rate and rank Eurovision Song Contest 2026 entries together!

## Features

- **Rate Songs**: Each family member can rate songs 1-5 stars, multiple times over the contest period
- **Video Player**: Watch official music videos directly in the app via YouTube embeds
- **Watch Party Mode**: Browse through all entries in a playlist-style viewer
- **Leaderboard**: See overall rankings, per-member stats, and rating activity
- **Time Filters**: Filter ratings by date range to see how opinions change over time
- **Comments**: Add optional comments with each rating
- **Expandable**: Easy to add new family members at any time

## Tech Stack

- **Next.js 15** (React 19, App Router)
- **Prisma** + SQLite (zero-config database)
- **Tailwind CSS** (dark Eurovision-themed UI)
- **canvas-confetti** (celebration effects on 5-star ratings!)

## Getting Started

```bash
# Install dependencies
npm install

# Set up the database and seed with Eurovision 2026 songs
npm run setup

# Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run setup` | Initialize database + seed data |
| `npm run db:reset` | Reset database and re-seed |

## Adding Family Members

Click the **+ Add** button on the home page to add new family members with a custom name, emoji, and color.

## Pre-populated Data

The app comes pre-loaded with all 35 Eurovision Song Contest 2026 entries (Vienna, Austria) including:
- Country, artist, and song title
- YouTube video IDs for watching entries directly in the app
