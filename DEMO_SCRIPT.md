# ClearView AI — 60-Second Demo Script

Goal: get judges to a real, working analysis with zero friction. The whole walkthrough runs against the live backend and real URLs.

## Before the demo

1. MongoDB running locally.
2. Backend running: `cd server && npm run seed && npm run dev` (port 4000).
3. Frontend running: `npm run dev` (root, port 3000).
4. Run the smoke test: `node server/scripts/...` — or just follow `SMOKE_TEST.md` manually.
5. Open `http://localhost:3000` in the browser.

## Script (≤ 60 seconds)

### 1. Landing (10s) — say, while scrolling
- "ClearView turns any website into a structure map, readability and clutter scores, an AI summary, and a clean reading view."
- Click **Open Live Dashboard** in the hero (or the navbar's **Open Dashboard**).

### 2. Sign in (5s)
- The login form is **pre-filled** with `test@clearview.dev` / `Demo123!`.
- Click **Sign in**.

### 3. Instant demo report (5s) — safety net if Gemini is rate-limited
- Click **Load demo report instantly**.
- Point out the header badge **"Demo report"** (honest labeling).

### 4. Live analysis (15–25s) — the headline moment
- The URL field already contains `https://example.com`. Better: type a real site the judges know (e.g. `https://en.wikipedia.org` or a local university/news site).
- Click **Analyze Website**. Narrate the progress steps as they tick: scraping → structure map → readability & clutter → AI summary.
- When the report appears: "Live analysis" badge turns green.

### 5. Read the report (20s) — call out 4 things
- **Score rings** — readability, clutter, cognitive load.
- **AI Summary + Key Insights / Recommendations** — generated from the scraped content.
- **Structure Map** — interactive; drag / zoom / click nodes.
- **Current vs Simplified** — the simplified clean-read rewrite.
- **Developer Insights** — metrics grid + Copy JSON.
- Click **Export PDF** → a real PDF downloads.

### 6. Close (5s)
- "Live report for that URL, with a downloadable PDF — all from a single URL input."

## Fallbacks (if anything fails)

| Symptom | What happens | Recovery |
| --- | --- | --- |
| Gemini 429 / timeout | Heuristic summary used automatically | Nothing to do — report still completes |
| Analyze fails entirely | Dashboard auto-loads the demo report and shows a notice | Point to the badge + notice |
| Demo report missing | Dashboard shows bundled sample data | Run `npm run seed` |
| URL won't resolve | Clear error message in the UI | Try another URL |

## Honesty rules (non-negotiable)

- Landing page dashboard preview + demo modal are labeled **Sample Analysis** / **Sample data**.
- The dashboard badges always say **Live analysis**, **Demo report**, or **Sample data** — never fake a live state.
- If anything shown isn't from a live run, say so out loud. Judges trust honesty.
