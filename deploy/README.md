# Demo deployment runbook

A temporary, internet-reachable deploy so the client can test the app. **Not the
production setup** — it serves the app against your local MySQL over a tunnel and
relies on your machine staying awake.

```
 GitHub Pages (React)  ──HTTPS──►  Render (Django API)  ──ngrok TCP──►  your Mac (MySQL)
 cicamatt.github.io                *.onrender.com                       127.0.0.1:3306
```

Auth is a bearer token in the `Authorization` header (no cookies), so the
cross-site frontend/backend split works in every browser.

## One-time setup

### 1. Database account (this machine)
```bash
./deploy/create-demo-db-user.sh           # prints the DB env vars for Render
```
Creates a least-privilege `ortodynamic_demo` MySQL user. Note the printed
password — it is shown only once.

### 2. Backend on Render
1. Push this branch to GitHub (Render and Pages both deploy from the repo).
2. In Render: **New → Blueprint**, pick this repo. It reads [`render.yaml`](../render.yaml)
   and creates the `ortodynamic-api` web service.
3. When prompted, fill the `sync: false` vars with the output of step 1
   (`DJANGO_DB_NAME/USER/PASSWORD`) and the tunnel host/port from step 3 below
   (`DJANGO_DB_HOST/PORT`).
4. Note the service URL, e.g. `https://ortodynamic-api.onrender.com`.

### 3. Database tunnel (this machine — keep running during the demo)
```bash
./deploy/start-db-tunnel.sh               # requires: brew install ngrok + authtoken
```
Copy the `Forwarding` host and port into Render's `DJANGO_DB_HOST` /
`DJANGO_DB_PORT`. The address changes on every restart — update Render and
redeploy if it does. (A reserved ngrok TCP address avoids this if the demo spans
multiple sessions.)

### 4. Frontend on GitHub Pages
1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Repo **Settings → Secrets and variables → Actions → Variables**: add
   `VITE_API_BASE_URL = https://ortodynamic-api.onrender.com/api/v1`
   (your Render URL + `/api/v1`).
3. Push, or run the **Deploy frontend to GitHub Pages** workflow manually. It
   publishes to `https://cicamatt.github.io/OrtoDynamic/`.

> If the Render service name or the GitHub Pages URL differ from the defaults,
> keep them in sync: the Pages origin must match `DJANGO_CORS_ALLOWED_ORIGINS`
> in [`render.yaml`](../render.yaml), and `VITE_BASE_PATH` in the workflow must
> match the repo name.

## Each demo session
1. `./deploy/start-db-tunnel.sh` and confirm the host/port still match Render.
2. Keep the terminal open and the machine awake.
3. Share `https://cicamatt.github.io/OrtoDynamic/`.

## Teardown
- Stop the tunnel (Ctrl-C).
- Drop the demo account:
  `mysql -u root -p -e "DROP USER 'ortodynamic_demo'@'127.0.0.1';"`
- Suspend or delete the Render service.

## Notes & limits
- **Availability:** the DB is your laptop. Sleep/Wi-Fi drop/reboot = app down.
- **Render free tier:** the API sleeps after ~15 min idle; the first request then
  takes ~50s to wake.
- **Security:** the tunnel endpoint is public, so the demo account uses a strong
  password and data-only privileges on one schema. Drop it after the demo.
- **Token TTL:** 12h by default; override with `DJANGO_AUTH_TOKEN_TTL_SECONDS`.
