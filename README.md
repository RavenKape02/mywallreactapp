# My Wall

A Facebook-style profile wall for Raven Caduyac, built for the CAPM / Semprove React + Next.js coding test (Test 2).

**Live:** https://mywallreactapp.vercel.app

## What it does

- **Share a message:** type your name and a message, then press **Share**.
- **Saved in Supabase:** every post goes into a `posts` table.
- **Newest first:** the feed shows the latest 50 posts, newest at the top, and they're still there after a refresh.
- **Live:** new posts from anyone appear without a refresh (Supabase Realtime).
- **Photos:** add a photo to a post. It's uploaded to Supabase Storage (images only, 5 MB max).
- **280-character limit:** a counter shows what's left, and the database enforces the limit too.
- **Your name is remembered:** the browser keeps it for next time.

## Stack

- Next.js 16 (App Router, Cache Components) with React 19 and TypeScript
- Tailwind CSS v4
- Supabase: Postgres, Realtime and Storage, through supabase-js
- Vitest for the post rules
- Deployed on Vercel

## Database

There's one table, `public.posts`:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | Primary key, set by the database |
| `author_name` | `text` | 1–40 characters |
| `message` | `text` | Up to 280 characters |
| `photo_url` | `text`, nullable | Must point to this project's `wall-photos` bucket |
| `created_at` | `timestamptz` | Set by the database |

**Access is limited.** Row Level Security is on. Visitors without an account can read posts and add new ones, but they can't edit or delete anything. They also can't set `id` or `created_at`, because inserts are only allowed on the author, message and photo columns.

**Live updates:** the table is in the `supabase_realtime` publication.

**Photos:** they go in a public `wall-photos` bucket that only accepts images, up to 5 MB each.

## Code tour

| File | What's in it |
| --- | --- |
| `src/lib/posts.ts` | Post rules: validation, newest-first merging, relative times |
| `src/lib/posts.test.ts` | Tests for those rules |
| `src/lib/supabase.ts` | The Supabase client and the feed query |
| `src/app/page.tsx` | The page. The profile is prerendered, and the feed streams in at request time. |
| `src/components/wall/composer.tsx` | The post form: name, message, photo, Share |
| `src/components/wall/wall.tsx` | The feed and its Realtime subscription |

## Run it locally

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Then run:

```bash
npm install
npm run dev      # http://localhost:3000
npm test
npm run build
```

Made by [Raven Caduyac](https://ravencaduyac.engineer) · [GitHub](https://github.com/RavenKape02)
