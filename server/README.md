# ClearView AI — Backend

AI-powered website analysis API: structure hierarchy, AI summaries, readability scores, clutter detection, and UX recommendations. Built with Node.js + Express + TypeScript following Clean Architecture.

## Tech Stack

- **Node.js + Express** — HTTP layer
- **TypeScript** — strict mode
- **MongoDB + Mongoose** — persistence
- **Google Gemini API** — summaries, insights, recommendations (heuristic fallback when no API key)
- **Puppeteer + Cheerio** — scraping & DOM parsing
- **JWT** — stateless authentication
- **Zod** — request validation
- **Helmet / CORS / express-rate-limit** — security
- **Winston + Morgan** — logging
- **Swagger** (`/api-docs`) — API documentation
- **PDFKit** — PDF reports (Noto fonts for Tamil/Japanese/Chinese/emoji)

## Folder Structure (Clean Architecture)

```
server/
├── src/
│   ├── config/        # env validation, database connection, swagger spec
│   ├── controllers/   # HTTP layer: parse request, call services, respond
│   ├── routes/        # Express routers (auth, analysis)
│   ├── services/      # business logic (auth, analysis pipeline, scraper, gemini, engines, pdf)
│   ├── repositories/  # Mongoose data access (user, analysis)
│   ├── middleware/    # auth (JWT), validate (zod), error handler, rate limiters
│   ├── models/        # Mongoose schemas (User, Analysis)
│   ├── validations/   # zod schemas (auth, analysis)
│   ├── types/         # shared TypeScript types + Express augmentation
│   ├── utils/         # ApiError, asyncHandler, jwt, logger, sanitize
│   ├── app.ts         # Express app assembly
│   └── index.ts       # bootstrap (connect DB, listen)
├── Dockerfile
├── docker-compose.yml
├── fonts/             # Noto fonts embedded in PDF reports (~7 MB)
├── .env.example
└── README.md
```

## Quick Start (Local)

Prerequisites: Node 20+, MongoDB running locally (or via Docker), and optionally a Google Gemini API key.

```bash
cd server
cp .env.example .env      # then edit values
npm install
npm run dev               # tsx watch -> http://localhost:4000
```

The scraper needs a Chromium. Two options on Windows:

```bash
# Option A: install Chrome via puppeteer (bundled browser)
npx puppeteer browsers install chrome

# Option B: point at your installed Chrome in .env
# PUPPETEER_EXECUTABLE_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
# (and install with PUPPETEER_SKIP_DOWNLOAD=true)
```

## Quick Start (Docker)

```bash
cd server
cp .env.example .env
docker compose up --build
```

`docker compose up` starts MongoDB + the API. Docs: http://localhost:4000/api-docs

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `NODE_ENV` | `development` / `production` | `development` |
| `PORT` | API port | `4000` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/clearview` |
| `JWT_SECRET` | JWT signing secret (min 16 chars) | dev fallback |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key (optional) | — |
| `GEMINI_MODEL` | Gemini model used for summaries | `gemini-3.1-flash-lite` |
| `RATE_LIMIT_WINDOW_MS` | Global rate limit window | `900000` |
| `RATE_LIMIT_MAX` | Max requests per window | `200` |
| `PUPPETEER_EXECUTABLE_PATH` | Path to an installed browser | — |

Env vars are validated at startup by Zod — the server fails fast with a readable message.

## Authentication

Register → receive JWT → send it as `Authorization: Bearer <token>` on protected routes.

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex","email":"alex@example.com","password":"password123"}'

curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'
# -> { "success": true, "data": { "user": {...}, "token": "<jwt>" } }

curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer <jwt>"
```

JWT is stateless: logout simply tells the client to discard the token. Protected routes return `401` for missing/expired/invalid tokens.

## API Endpoints

Base URL: `http://localhost:4000/api`

| Method | Path | Auth | Body / Params | Description |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/register` | no | `{name, email, password}` | Create account |
| `POST` | `/auth/login` | no | `{email, password}` | Get JWT |
| `POST` | `/auth/logout` | yes | — | Invalidate client session |
| `POST` | `/analyze` | yes | `{url}` | Run full analysis |
| `GET` | `/history` | yes | `?page=&limit=` | Paginated history |
| `GET` | `/analysis/:id` | yes | — | Single analysis |
| `GET` | `/analysis/:id/pdf` | yes | — | Download PDF report |
| `DELETE` | `/analysis/:id` | yes | — | Delete analysis |
| `GET` | `/health` | no | — | Liveness check |

### Analyze a website

```bash
curl -X POST http://localhost:4000/api/analyze \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://acme.io"}'
```

Response (abridged):

```json
{
  "success": true,
  "data": {
    "_id": "671f...",
    "url": "https://acme.io",
    "title": "Acme — Build in minutes",
    "screenshot": "data:image/jpeg;base64,...",
    "summary": {
      "text": "Acme is a focused SaaS landing page...",
      "keyInsights": ["Clear hero CTA", "Pricing two clicks deep"],
      "simplifiedContent": "# Acme\n..."
    },
    "readabilityScore": 92,
    "readabilityGrade": "A",
    "clutterScore": 24,
    "clutterIssues": ["14 links detected — above recommended density"],
    "cognitiveLoad": { "score": 84, "level": "high" },
    "hierarchy": {
      "tree": { "id": "root", "label": "Acme — Build in minutes", "children": [] },
      "nodes": [{ "id": "root", "label": "Acme — Build in minutes" }],
      "edges": []
    },
    "recommendations": ["Move pricing into the primary nav", "..."],
    "createdAt": "2024-10-27T..."
  }
}
```

`hierarchy` includes `tree` (`{id, label, children}`) plus `nodes`/`edges` arrays, ready to feed directly into React Flow.

`cognitiveLoad` is a composite metric of readability + clutter: `round(readabilityScore * 0.5 + (100 - clutterScore) * 0.5)` → `level` is `low` (<45), `medium` (≤70), or `high`.

### PDF report

```bash
curl -X GET http://localhost:4000/api/analysis/671f.../pdf \
  -H "Authorization: Bearer <jwt>" \
  --output report.pdf
```

PDF reports render any text present in the analysis — including Tamil, Japanese, Chinese, and emoji — by embedding Noto fonts (`server/fonts/`). Latin text uses the built-in Helvetica; the Docker image ships the fonts automatically.

## How the Analysis Pipeline Works

1. **Scraper** (Puppeteer + Cheerio) — loads the page, captures a JPEG screenshot (base64), extracts title, headings, paragraphs, links, buttons, navigation, and a generic block list; computes word count and DOM depth.
2. **Engines** run in parallel (`Promise.all`):
   - **Readability** — average sentence length, heading density, content density, navigation complexity → `{score: 0-100, grade: A-F}`.
   - **Clutter** — link/button overload, repeated blocks, large menus → `{score: 0-100, issues[]}`.
   - **Structure** — builds a `{tree, nodes, edges}` hierarchy from headings + navigation, React Flow compatible.
   - **Cognitive load** — derived from readability + clutter → `{score: 0-100, level: low|medium|high}`.
   - **Gemini** — generates summary, key insights, recommendations, simplified content. **Graceful fallback:** if `GEMINI_API_KEY` is missing or the call fails, the API falls back to heuristic content derived from the scraped data — the demo never 500s. Calls use a 10 s timeout with up to 3 retries (429/5xx).
3. **Persistence** — result is saved to the current user's history.

## Security

- Helmet headers, CORS restricted to `CLIENT_URL`
- Global + route-specific rate limiting
- Zod validation on every body/params/query
- bcrypt (12 rounds) password hashing; passwords never serialized to responses
- JWT protection on all analysis routes + ownership checks (`userId` scoping)
- **SSRF protection** — `/analyze` blocks localhost, `.local`/`.localhost`, private/reserved IPv4 ranges (0/10/127/169.254/172.16-31/192.168), link-local IPv6, and hostnames that resolve to private IPs (422)
- Input sanitization (URL normalization, text cleanup)
- Centralized error handling — internal details hidden in production

## Error Format

All errors return the same shape:

```json
{ "success": false, "message": "Validation failed", "errors": [{ "field": "url", "message": "..." }] }
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Run with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output |
| `npm run typecheck` | Type-check only |
| `docker compose up` | Run API + MongoDB in containers |

## Notes

- Logs are written to `logs/` (console + `error.log` + `combined.log`).
- Screenshots are stored inline as base64 data URIs (demo-friendly; swap for S3/GCS in production).
- Analysis is rate-limited to 20/hour per user.
