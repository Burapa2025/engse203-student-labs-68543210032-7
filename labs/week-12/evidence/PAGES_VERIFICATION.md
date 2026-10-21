# LAB 12 — Pages verification

Verified on 2026-10-21 from branch `lab/week-12`, source commit `c7b2b48425f9c6957398d7894bdaaceb90dd73b6`.

## Published result

This Pages entry presents the test and debugging evidence for Campus Service (React + Express + SQLite). GitHub Pages hosts static files; running the interactive full-stack application also requires an Express API and a database.

## Verification environment

- Windows, Node.js `v24.18.0`, npm `11.16.0`.
- Source copied to a temporary validation directory, excluding `node_modules`, local `.env` files, database files, build output and coverage output.
- Dependencies installed from lockfiles with `npm ci --prefix .`, `npm ci --prefix api` and `npm ci --prefix frontend` (all exit 0).
- Tests used `DB_FILE=:memory:` and cleared `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`; no connection to a deployed database was used.
- The original `.github/workflows/check.yml` from this branch was copied into the isolated validation directory for the checker's repository-level CI inspection. No workflow was changed.

## Commands and observed results

Run the following from `labs/week-12/source` after installing dependencies:

```powershell
$env:DB_FILE=':memory:'
$env:NODE_ENV='test'
Remove-Item Env:TURSO_DATABASE_URL,Env:TURSO_AUTH_TOKEN -ErrorAction SilentlyContinue
npm test
npm run check
npm run coverage --prefix api
npm run build --prefix frontend
```

| Command | Observed result |
| --- | --- |
| `npm test` | Exit 0. API: 2 test files, 41/41 tests passed. Frontend: 1 test file, 3/3 tests passed. |
| `npm run check` | Exit 0. In-class CP44–CP47: 20/20; challenge: 2/2; total: 22/22. |
| `npm run coverage --prefix api` | Exit 0. 41/41 tests passed; statements 88.19% (127/144), branches 72.41% (63/87), functions 87.87% (29/33), lines 90.64% (126/139). |
| `npm run build --prefix frontend` | Exit 0. Vite 8.1.5 transformed 42 modules and generated `dist/index.html`, CSS and JavaScript assets. |

The checker verifies input boundaries, CRUD integration, regression cases, `/api/health`, frontend summary calculations, the debug log and CI configuration. The integration suite exercises an Express application through Supertest with SQLite in memory. These results establish local automated checks; a deployed API and a browser session were not part of this verification.

## API and backend requirements

- Use Node.js 22.13 or newer with the API dependencies from `api/package-lock.json`.
- A local API normally listens on `http://localhost:3001`; the frontend development server uses `http://localhost:5173`.
- The frontend reads `VITE_API_BASE_URL`; its default is `http://localhost:3001`. A public deployment needs the HTTPS URL of a running backend and a matching `CORS_ORIGIN` for the frontend origin.
- The API needs the SQLite schema at `api/data/schema.sql` and a writable database location selected by `DB_FILE`. `DB_FILE=:memory:` is suitable for disposable verification. Persistent deployment needs a durable database location or the separately configured remote database supported by the source.
- `/api/health` reports service and database connectivity. CRUD operations use `/api/requests`; user endpoints use `/api/users`.
- For production on one backend origin, build the frontend with `VITE_API_BASE_URL` set to an empty string so it requests `/api/...`, then run the API with `NODE_ENV=production`. Hosting a static build on Pages alone does not supply these endpoints.

## Existing project evidence

- [Test case design](../source/TEST_CASES.md)
- [Debugging log and regression cases](../source/DEBUG_LOG.md)
- [Original bug reports](../source/BUG_REPORTS.md)
- [API contract](../source/API_CONTRACT.md)
- [Application setup](../source/README.md)

No screenshot or live demo URL is claimed by this verification. The original `DEMO.md` still contains an unfilled recording checklist.
