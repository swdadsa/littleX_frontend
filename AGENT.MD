# LittleX Frontend Agent Notes

## Stack
- Vite + React + TypeScript
- Tailwind CSS v4 (PostCSS via `@tailwindcss/postcss`)
- React Router v6
- Axios for API calls

## Key Structure
- `src/api/`: API clients (axios instance + endpoint wrappers)
- `src/hooks/`: UI/data hooks (auth, posts, comments, search)
- `src/components/`: Shared UI pieces (Shell, Comments)
- `src/pages/`: Route pages (Login, Explore, Profile, SearchResults)
- `src/utils/`: Token/user storage, error handling, time formatting

## Auth & Storage
- Token stored in `localStorage` key `littlex_token`.
- User stored in `localStorage` key `littlex_user`.
- Axios `Authorization: Bearer <token>` auto-injected in `src/api/client.ts`.

## Routes
- `/login`
- `/explore`
- `/profile` (self profile)
- `/profile/:username` (view other user)
- `/search?query=...` (search results)

## APIs Wired
- Login: `POST /user/login`
- Posts: `GET /posts`
- Post like: `POST /like` with `{ post_id }`
- Comments list: `GET /comment?post_id=...`
- Comment like: `POST /comment/like` with `{ comment_id }`
- Comment create: `POST /comment` with `{ post_id, comment }`
- User search: `GET /user/getByUsername?username=...`

## UI Behaviors
- Left/right sidebars fixed; center column scrolls.
- Posts show relative time (`src/utils/time.ts`).
- Comments load on demand and show relative time + like count.
- Search is debounced (350ms) with dropdown results.

## Dev Commands
- Install: `npm install`
- Run: `npm run dev`
- Build: `npm run build`
