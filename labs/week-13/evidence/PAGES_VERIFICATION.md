# LAB 13 — Pages verification

Verified on 2026-10-21 from branch `lab/week-13`, source commit `a66f5400b0844d921274a4018c76ffd848d32ebc`.

## Published result

This Pages entry presents authentication, authorization and security evidence for Campus Service (React + Express + SQLite). GitHub Pages hosts static files; running the interactive full-stack application also requires an Express API and a database.

## Verification environment

- Windows, Node.js `v24.18.0`, npm `11.16.0`.
- Source copied to a temporary validation directory, excluding `node_modules`, local `.env` files, database files, build output and coverage output.
- Dependencies installed from lockfiles with `npm ci --prefix .`, `npm ci --prefix api` and `npm ci --prefix frontend` (all exit 0).
- Tests used `DB_FILE=:memory:` and cleared `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`; no connection to a deployed database was used.
- The security checker uses development or disposable checker secrets. It verifies rejection of missing production secrets without reading local `.env` values.

## Commands and observed results

Run the following from `labs/week-13/source` after installing dependencies:

```powershell
$env:DB_FILE=':memory:'
$env:NODE_ENV='test'
Remove-Item Env:TURSO_DATABASE_URL,Env:TURSO_AUTH_TOKEN -ErrorAction SilentlyContinue
npm test
npm run check
npm run build --prefix frontend
```

| Command | Observed result |
| --- | --- |
| `npm test` | Exit 0. API: 4 test files, 68/68 tests passed. Frontend: 1 test file, 3/3 tests passed. |
| `npm run check` | Exit 0. In-class CP48–CP52: 23/23; challenge: 4/4; total: 27/27. |
| `npm run build --prefix frontend` | Exit 0. Vite 8.1.5 transformed 42 modules and generated `dist/index.html`, CSS and JavaScript assets. |

Security checks observed:

- Input length boundaries and rejection of request bodies larger than 10 KB.
- Salted scrypt password hashes, password verification and hashed staff seed records.
- Successful JWT login, token expiry information and uniform errors for incorrect credentials.
- Missing or forged token returns 401; a valid non-staff token returns 403; staff PUT/DELETE return 200/204.
- Public GET/POST remain available, and the earlier delete/create regression remains fixed.
- Production refuses to start without `JWT_SECRET`; production error responses omit stack traces.
- `X-Content-Type-Options: nosniff`; a sixth login attempt after five failures returns 429.
- The frontend API client attaches a stored Bearer token; `render.yaml` requests generated JWT secret configuration.

The integration suites exercise Express through Supertest using SQLite in memory. These results establish local automated checks; a deployed API and a browser login session were not part of this verification.

## API and backend requirements

- Use Node.js 22.13 or newer with the API dependencies from `api/package-lock.json`.
- A local API normally listens on `http://localhost:3001`; the frontend development server uses `http://localhost:5173`.
- The frontend reads `VITE_API_BASE_URL`; its default is `http://localhost:3001`. A public deployment needs the HTTPS URL of a running backend and a matching `CORS_ORIGIN` for the frontend origin.
- The API needs the SQLite schema at `api/data/schema.sql` and a writable database location selected by `DB_FILE`. `DB_FILE=:memory:` is suitable for disposable verification. Persistent deployment needs a durable database location or the separately configured remote database supported by the source.
- `NODE_ENV=production` requires `JWT_SECRET`. Supply a deployment secret through the backend environment. `/api/auth/login` issues tokens; staff roles are required for PUT and DELETE on `/api/requests/:id`.
- `/api/health` reports service and database connectivity. CRUD operations use `/api/requests`; user endpoints use `/api/users`.
- For production on one backend origin, build the frontend with `VITE_API_BASE_URL` set to an empty string so it requests `/api/...`, then run the API in production. Hosting a static build on Pages alone does not supply these endpoints.
- The supplied frontend includes token storage and Bearer forwarding. The source describes a complete login screen as later Term Project work, so this report does not claim a finished browser sign-in flow.

## Existing project evidence

- [Test case design](../source/TEST_CASES.md)
- [Debugging log and regression cases](../source/DEBUG_LOG.md)
- [API contract](../source/API_CONTRACT.md)
- [Application and authentication setup](../source/README.md)

No screenshot or live demo URL is claimed by this verification. The original `DEMO.md` still contains an unfilled recording checklist.
