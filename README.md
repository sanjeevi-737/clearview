# ClearView AI

**Understand any website in seconds.** ClearView converts any site into a visual structure map, plain-language AI summary, readability & clutter scores, a clean reading view, and a developer insights report.

## What it does

- **Real analysis pipeline** — scrape any public URL (Puppeteer + Cheerio), then compute readability, clutter, cognitive load, and a React Flow–compatible structure graph.
- **AI summary** — Gemini generates a plain-language summary, key insights, recommendations, and a simplified "clean read" rewrite. Falls back to deterministic heuristics when the API is rate-limited or unset.
- **Visual report** — score rings, AI summary + insights, recommendations, interactive structure map, current-vs-simplified comparison, clean read verdict, developer metrics with JSON export, and a downloadable PDF report.
- **Hackathon-safe demo** — seeded demo account, instant demo report endpoint, and a bundled sample fallback so the product never shows a blank screen.

## Architecture

```
├── app/                  Next.js 15 frontend
│   ├── page.tsx          Landing page (marketing + sample preview)
│   └── dashboard/        Live analysis dashboard (login → analyze → report)
├── components/
│   ├── dashboard/        Real report UI (form, report, structure map, skeleton, login)
│   └── ...               Landing page components
├── lib/                  Frontend API client + types + sample fallback
└── server/               Express + TypeScript backend (ESM)
    ├── src/
    │   ├── services/     scrape, readability, clutter, structure, gemini, pdf, cache
    │   ├── controllers/  API handlers (analyze, history, demo, pdf)
    │   ├── models/       MongoDB schemas (User, Analysis)
    │   ├── repositories/ Mongo queries
    │   └── validations/  Zod schemas
    └── scripts/          seed-demo.ts (demo user + demo report)
```

## Requirements

- Node.js 20+
- MongoDB running locally (default `mongodb://127.0.0.1:27017/clearview`)

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env   # then set GEMINI_API_KEY (optional) and GEMINI_MODEL
npm install
npm run seed           # creates demo user + demo report (repeatable)
npm run dev            # http://localhost:4000
```

Environment variables (see `server/.env.example`):

| Variable | Default | Notes |
| --- | --- | --- |
| `PORT` | `4000` | Server port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/clearview` | MongoDB connection |
| `JWT_SECRET` | dev default | ≥16 chars; change in production |
| `GEMINI_API_KEY` | — | Optional; unset → heuristic summaries |
| `GEMINI_MODEL` | `gemini-3.1-flash-lite` | Model used for summaries |
| `CLIENT_URL` | `http://localhost:3000` | Allowed CORS origin(s), comma-separated (used in production) |
| `DEMO_EMAIL` / `DEMO_PASSWORD` / `DEMO_URL` | `test@clearview.dev` / `Demo123!` / `https://example.com` | Seed script inputs |

> Dev mode allows any localhost origin for CORS; production restricts to `CLIENT_URL`.

### 2. Frontend

```bash
npm install
npm run dev            # http://localhost:3000 (or 3001 if busy)
```

Set `NEXT_PUBLIC_API_URL` if the API is not at `http://localhost:4000/api`.

## Demo credentials

| Field | Value |
| --- | --- |
| Email | `test@clearview.dev` |
| Password | `Demo123!` |

The login form pre-fills these. The seed script creates the user and a demo report and **resets the password on every run**, so login always works.

## API (summary)

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | — | Create account |
| `POST` | `/api/auth/login` | — | Returns `data.token` |
| `POST` | `/api/analyze` | Bearer | Analyze a URL (`?cache=0` forces a fresh run; `data.meta.cached` indicates a cache hit) |
| `GET` | `/api/history` | Bearer | Paginated report history |
| `GET` | `/api/analysis/demo` | — | Latest seeded demo report |
| `GET` | `/api/analysis/:id` | Bearer | Single report |
| `GET` | `/api/analysis/:id/pdf` | Bearer | PDF report download |
| `DELETE` | `/api/analysis/:id` | Bearer | Delete a report |
| `GET` | `/api-docs` | — | Swagger UI |
| `GET` | `/health` | — | Liveness |

## Deployment (Vercel + Render)

This app is two parts: the **Next.js frontend → Vercel**, and the **Express backend → Render** (Puppeteer + MongoDB can't run on Vercel's serverless functions). Deployment configs are already in the repo: `vercel.json` and `render.yaml`.

### 1. MongoDB (needed before Render)

Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas) (M0), then:

- Add a database user, allow access from anywhere (`0.0.0.0/0`), and copy the connection string.
- In Render's `render.yaml` deploy step, set `MONGODB_URI` to `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/clearview`.

### 2. Backend → Render (Docker)

Render deploys the backend from the `server/` folder using the existing `Dockerfile` (installs Chromium for Puppeteer).

1. Push the repo to GitHub.
2. Render dashboard → **New + → Blueprint** → pick the repo → **Apply**.
3. Fill in the prompted env vars (`sync: false` in `render.yaml`):
   - `CLIENT_URL` → your Vercel URL, e.g. `https://clearview.vercel.app`
   - `MONGODB_URI` → Atlas connection string
   - `GEMINI_API_KEY` → optional, leave blank for heuristic summaries
   - `JWT_SECRET` → auto-generated for you
4. After the first deploy, open the service's **Shell** tab and run once:

   ```bash
   npx tsx scripts/seed-demo.ts
   ```

   This creates the demo user (`test@clearview.dev` / `Demo123!`) and a demo report.

5. Your API URL will be `https://clearview-api.onrender.com/api`. Check `https://clearview-api.onrender.com/health`.

> Free Render instances sleep after ~15 min of inactivity; the first request after waking is slow. Upgrade to a paid plan if you need it always-on and faster Puppeteer runs.

### 3. Frontend → Vercel

1. Vercel dashboard → **Add New → Project** → import the same GitHub repo. Root directory stays `/` (Vercel auto-detects Next.js).
2. Under **Environment Variables**, add:

   | Name | Value |
   | --- | --- |
   | `NEXT_PUBLIC_API_URL` | `https://clearview-api.onrender.com/api` |

3. **Deploy**. The frontend reads `NEXT_PUBLIC_API_URL` in `lib/api.ts`, so login/analyze hit your live Render backend.

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `503 Analysis engine unavailable` | Chromium not starting — confirm `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium` and `PUPPETEER_SKIP_DOWNLOAD=true` are set on the Render service. |
| CORS errors in the browser | Set `CLIENT_URL` on Render to exactly your Vercel URL (with `https://`, no trailing slash). |
| Login works but analyze is slow/times out | Free instance is cold or Puppeteer scraping a heavy site — retry or use the demo report. |
| Demo login fails | Run `npx tsx scripts/seed-demo.ts` again from the Render Shell. |

## How scoring works

- **Readability** (0–100, higher is better) — weighted blend of average sentence length, heading density, content density, and navigation complexity. Grade A–F.
- **Clutter** (0–100, lower is better) — noise signals from scripts, sticky elements, autoplay, and competing CTAs.
- **Cognitive load** (0–100, lower is better) — `readability × 0.5 + (100 − clutter) × 0.5`, bucketed into low/medium/high.
- **Structure graph** — headings, navigation, and page blocks are compiled into `{ tree, nodes, edges }` rendered as an interactive map.

## Notes for the demo

- The landing page's dashboard preview and demo modal use **labeled sample data** ("Sample Analysis" badge). The real dashboard lives at `/dashboard` and is fully live.
- If live analysis fails (e.g. Gemini rate limit), the dashboard falls back to the seeded demo report, then to bundled sample data, and always shows a notice telling you which source you're viewing.
- Repeated analyses of the same URL within 10 minutes are served from cache.

## Scripts

| Location | Command | Purpose |
| --- | --- | --- |
| root | `npm run dev` / `build` / `lint` | Frontend |
| server | `npm run dev` / `build` / `typecheck` / `lint` | Backend |
| server | `npm run seed` | Create demo user + demo report |
| server | `docker:build` / `docker:up` | Dockerized backend |

See `DEMO_SCRIPT.md` for a 60-second judge walkthrough and `SMOKE_TEST.md` for a pre-demo checklist.
