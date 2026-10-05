# Portfolio agent

A portfolio page with a chat box. Visitors ask questions and an agent you built on platform.claude.com answers from your CV. A Cloudflare Worker sits in between, so your API key never reaches the browser.

Live example: https://alvee1994.github.io/portfolio/

```
Visitor -> GitHub Pages (this page) -> Cloudflare Worker -> Claude Managed Agent
```

```
index.html          your page (content + chat widget)
app.js              chat logic, no edits needed
config.js           Worker address and Turnstile sitekey (public)
worker/worker.js    the Worker, no edits needed
worker/wrangler.toml  Worker settings
worker/test.mjs     checks the Worker against the real API
```

## Before you start

- GitHub account
- Cloudflare account (free)
- Node.js 18 or newer
- Claude Console account with a little credit

## Steps

### 1. Fork and clone

Fork this repo to your account and keep the name `portfolio`. Then:

```
git clone git@github.com:<github-username>/portfolio.git
cd portfolio
```

### 2. Build your agent

On platform.claude.com:

1. Create an agent. Tell it who it speaks for, what it may say, and what it must not (no phone number, no salary, no promises).
2. Add your CV as a file.
3. Create an environment and a **deployment**. Set a per-session budget. Copy the deployment id (`depl_...`).
4. Create a **new API key** just for this site and set a monthly spend limit on it. The Worker is public, so this limit is your real cost cap.

### 3. Deploy the Worker

Edit `worker/wrangler.toml`. Change the two lines marked `CHANGE`:

- `ALLOWED_ORIGIN = "https://<github-username>.github.io"` (no path, no trailing slash)
- `DEPLOYMENT_ID = "depl_..."`

Then:

```
cd worker
npx wrangler login
npx wrangler deploy
openssl rand -hex 32 | npx wrangler secret put SIGNING_SECRET
npx wrangler secret put ANTHROPIC_API_KEY
```

`deploy` prints your Worker address, `https://portfolio-agent.<you>.workers.dev`. Keep it.

### 4. Turnstile (bot check)

dash.cloudflare.com > Turnstile > Add widget. Hostname: `<github-username>.github.io`. Mode: Managed.

```
npx wrangler secret put TURNSTILE_SECRET
```

Paste the **secret key**. Keep the **sitekey** for the next step.

### 5. Your page

- `config.js`: set `CHAT_API` to your Worker address and `TURNSTILE_SITEKEY` to your sitekey.
- `index.html`: change `<title>`, the description, and everything between the `CHANGE` comment and the chat widget. Keep the ids `ask`, `launch` and `panel`.

Never put your CV file in the repo if it has your phone number or address. The repo is public. The agent already has it.

### 6. Publish

```
cd ..
git add .
git commit -m "My portfolio"
git push
```

Repo Settings > Pages > Source: Deploy from a branch > `main` / `(root)` > Save. Forks have Pages switched off until you do this. Wait 1 to 2 minutes, then open `https://<github-username>.github.io/portfolio/` and click "Ask my agent".

## What protects you

- The API key lives only in the Worker. `config.js` is public, so never put a secret in it.
- Only your page's origin can call the Worker from a browser. Other clients can fake the origin, so this is a speed bump, not a lock.
- Turnstile stops bots from starting runs. The Worker refuses Cloudflare's test secret unless the page runs on localhost.
- Each session id is signed by the Worker and expires after 2 hours. Visitors cannot read or write anyone else's session.
- The browser can only start your one deployment and talk to its own session. It cannot pick another agent, file or budget.
- Rate limits per visitor: 5 new chats a minute, 120 messages or polls a minute. Change them in `worker/wrangler.toml`.
- Only the agent's text goes back to the page. Tool calls and results stay in the Worker.
- The page inserts text with `textContent`, so nothing the agent or a visitor writes can run as HTML. A Content-Security-Policy in `index.html` allows only your own scripts and Turnstile.
- A chat (and its cost) starts only when a visitor opens it.
- Rate limits stop one visitor, not a crowd. The spend limit on your key is what caps cost.

## When something breaks

| You see | Cause | Fix |
|---|---|---|
| `error: Not allowed` | `ALLOWED_ORIGIN` does not match the page | Exactly `https://<you>.github.io`, then `npx wrangler deploy` |
| `error: Bot check failed` | Turnstile secret and sitekey from different widgets, or hostname missing | Check the widget's hostname and both keys |
| `error: Server misconfigured` | Turnstile test secret on a public page | Put your real Turnstile secret |
| `error: Agent unavailable` | Wrong API key or deployment id, or budget used up | Check the key secret, `DEPLOYMENT_ID`, and the Console |
| `error: Too many requests` | Rate limit | Wait a minute |
| `error: Failed to fetch` | Wrong `CHAT_API`, or Worker not deployed | Check `config.js` and the address from `deploy` |
| Old page after a push | Pages build or browser cache | Wait 2 minutes, hard refresh |

Browser DevTools > Console and Network show the details. `npx wrangler tail` (in `worker/`) shows the Worker's logs live.

## Check the Worker

```
cd worker
ANTHROPIC_API_KEY=sk-ant-... DEPLOYMENT_ID=depl_... node test.mjs
```

This runs the Worker against the real API and spends a few cents.

## Good to know

- Changing `wrangler.toml` needs `npx wrangler deploy` again. Secrets do not, and a deploy keeps them.
- `git push` updates the page only. It never touches the Worker or its secrets.
- If you put the Worker on your own domain, add it to `connect-src` in the CSP line of `index.html`.
