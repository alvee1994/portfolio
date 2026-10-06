// Public settings for the page. Never put a secret here: everyone can read this file.

// CHANGE: your Worker addresses, printed by `npx wrangler deploy`. No trailing slash.
// The first enabled entry is the default. disabled: true hides an entry but keeps its Worker (Claude API and Managed Agent cost too much to leave open).
// Keep one entry to hide the switch. kind: "session" = Managed Agent deployment, "chat" = Messages API or OpenRouter.
window.BACKENDS = [
  { id: "openrouter", label: "OpenRouter",    kind: "chat",    url: "https://worker-openrouter.ahmedalv94.workers.dev" },
  { id: "messages",   label: "Claude API",    kind: "chat",    url: "https://worker-claude-messages.ahmedalv94.workers.dev", disabled: true },
  { id: "console",    label: "Managed Agent", kind: "session", url: "https://worker-claude-console-deployment.ahmedalv94.workers.dev", disabled: true },
];

// First message in the chat. Shown as is, no model call.
window.GREETING = "Hi, I'm Alvee's assistant. Ask me about Alvee's work in AI, automation, cloud or healthcare, or check when Alvee is free to meet.";

// Show token counts (incl. cache reads) under each reply. Handy for a demo, off for a real portfolio.
window.SHOW_USAGE = false;

// CHANGE: your Turnstile sitekey (dash.cloudflare.com > Turnstile). Public by design.
// For practice you can use Cloudflare's test key "1x00000000000000000000AA", which always passes.
window.TURNSTILE_SITEKEY = "0x4AAAAAAFOSpt5_xPpQeOkx";
