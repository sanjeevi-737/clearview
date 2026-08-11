# ClearView AI — Smoke Test Checklist

Run this before demoing. Expected = the goal state; if any line is unexpected, fix before demo.

## 1. Backend health

```bash
curl http://localhost:4000/health
```

- [ ] Returns `{"success":true,"status":"ok",...}`
- [ ] `http://localhost:4000/api-docs` loads Swagger UI

## 2. Seed + demo report

```bash
cd server
npm run seed
```

- [ ] Logs `Demo analysis ready` with `demo: true`
- [ ] Login works: `POST /api/auth/login` with `test@clearview.dev` / `Demo123!` returns `data.token`
- [ ] `GET http://localhost:4000/api/analysis/demo` (no auth) returns a report with:
  - `readabilityScore`, `clutterScore`, `cognitiveLoad.score`
  - `hierarchy.nodes` length ≥ 3 and `hierarchy.edges` length ≥ 2
  - `summary.text` non-empty, `summary.simplifiedContent` non-empty
  - `metrics.avgSentenceLength` present

## 3. Frontend

```bash
npm run dev   # root
```

- [ ] `http://localhost:3000` loads the landing page
- [ ] Landing dashboard preview is labeled **Sample Analysis** (not "Live")
- [ ] `http://localhost:3000/dashboard` loads the sign-in form with pre-filled demo credentials
- [ ] Click **Sign in** → analyzer form appears

## 4. In-browser E2E

- [ ] Click **Load demo report instantly** → full report renders (scores, AI summary, structure map, comparison, dev insights)
- [ ] Type a real URL, click **Analyze Website** → progress steps animate → **Live analysis** report renders
- [ ] Structure map shows interactive nodes (drag/zoom)
- [ ] **Export PDF** downloads a file (`clearview-report-<id>.pdf`)
- [ ] **Copy JSON** copies the report to the clipboard
- [ ] Repeat the same URL → loads from cache quickly (`meta.cached: true`)
- [ ] No console errors (DevTools)

## 5. Failure-path checks (optional but good)

- [ ] Stop the backend, click **Analyze** → notice shown, demo/sample fallback renders (no blank screen)
- [ ] Stop MongoDB, load `/dashboard` → graceful error, not a crash

## 6. Hygiene

- [ ] `cd server && npm run typecheck && npm run lint` clean
- [ ] Root `npm run lint && npm run build` clean
- [ ] No real API keys in any committed file (check `git status` / `.env` is gitignored)
