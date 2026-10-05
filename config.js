// Public settings for the page. Never put a secret here: everyone can read this file.

// CHANGE: your Worker address, printed by `npx wrangler deploy`. No trailing slash.
window.CHAT_API = "https://portfolio-agent.ahmedalv94.workers.dev";

// CHANGE: your Turnstile sitekey (dash.cloudflare.com > Turnstile). Public by design.
// For practice you can use Cloudflare's test key "1x00000000000000000000AA", which always passes.
window.TURNSTILE_SITEKEY = "0x4AAAAAAFOSpt5_xPpQeOkx";
