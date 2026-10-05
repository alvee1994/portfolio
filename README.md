# Portfolio agent template

A page with a chat box. Visitors talk to an agent you built on platform.claude.com. A Cloudflare Worker sits in between so your API key never reaches the browser.

Visitor -> GitHub Pages (page) -> Cloudflare Worker -> Claude Managed Agent

```
index.html, app.js, config.js   the page (GitHub Pages)
worker/                         the Worker (Cloudflare)
```

## Steps

1. **Fork** this repo to your GitHub account. Name it `portfolio`.
2. **Build your agent** on platform.claude.com: create an agent, add your CV as a file, set what it should and should not say. Create an environment and a **deployment**. Copy the deployment id (`depl_...`).
3. **Make a dedicated API key** in the Console and set a monthly spend limit on it. The Worker is public, so this limit is your cost cap.
4. Edit `worker/wrangler.toml`: set `DEPLOYMENT_ID` and `ALLOWED_ORIGIN` (`https://<your-github-username>.github.io`, no slash, no path).
5. **Deploy the Worker.** In `worker/`:
   ```
   npx wrangler login
   npx wrangler deploy
   openssl rand -hex 32 | npx wrangler secret put SIGNING_SECRET
   npx wrangler secret put ANTHROPIC_API_KEY
   ```
   Note the `https://portfolio-agent.<you>.workers.dev` address it prints.
6. **Turnstile.** dash.cloudflare.com > Turnstile > Add widget. Hostname: `<your-github-username>.github.io`. Then `npx wrangler secret put TURNSTILE_SECRET` with the secret. Keep the sitekey for the next step.
7. Edit `config.js`: set `CHAT_API` to the Worker address and `TURNSTILE_SITEKEY` to your sitekey. Edit `index.html` for your intro text.
8. `git add . && git commit -m "my page" && git push`
9. Repo Settings > Pages > Deploy from branch `main`, folder `/ (root)`. Wait 1 to 2 minutes.
10. Open `https://<your-github-username>.github.io/portfolio/` and click "Ask about me".

## What protects you

- The key lives only in the Worker. `config.js` is public: never put a secret in it.
- Only your page's origin can call the Worker from a browser. Other clients can fake an origin, so this is a speed bump, not a lock.
- Turnstile blocks bots from starting runs. The Worker refuses Cloudflare's test secret unless the page is on localhost.
- Each session id is signed by the Worker and expires after 2 hours. Visitors cannot read or write other sessions.
- The browser can start your one deployment and send text to its own session. It cannot pick another agent, file or budget.
- Starting a run: 5 per minute per visitor. Messages and polling: 120 per minute. Change them in `worker/wrangler.toml`.
- Only agent text goes back to the page. Tool calls and results stay in the Worker.
- The page inserts text with `textContent`, so agent or visitor text cannot run as HTML. A Content-Security-Policy in `index.html` limits scripts to your own files and Turnstile.
- Rate limits stop one visitor, not a crowd. The spend limit on your key is the real cap.

## Check the Worker

```
cd worker
export ANTHROPIC_API_KEY=... DEPLOYMENT_ID=depl_...
node test.mjs
```

This runs the Worker against the real API and spends a few cents.

## Traps

- The Turnstile test sitekey (`1x00000000000000000000AA`) always passes. Fine for practice, replace it before you share the link.
- `ALLOWED_ORIGIN` must match exactly. `https://you.github.io/portfolio` with a path will not work.
- The page's CSP allows `https://*.workers.dev`. If you use your own domain for the Worker, add it to `connect-src` in `index.html`.
- Changing `wrangler.toml` needs `npx wrangler deploy` again. Secrets do not.
