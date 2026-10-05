const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const API = window.CHAT_API;
let session = null; // { sid, sig } from the Worker
const seen = new Set();

async function api(path, body) {
  const r = await fetch(API + path, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || 'HTTP ' + r.status);
  return j;
}

function add(cls, text) {
  const d = document.createElement('div');
  d.className = cls === 'note' ? 'note' : 'msg ' + cls;
  d.textContent = text; // untrusted text, never innerHTML
  $('log').append(d);
  d.scrollIntoView({ block: 'end' });
}

// Three dots while the agent works. Removed when its text arrives or the turn ends.
let dots = null;
function showTyping() {
  if (dots) return;
  dots = document.createElement('div');
  dots.className = 'msg agent typing';
  dots.setAttribute('aria-label', 'The agent is typing');
  for (let i = 0; i < 3; i++) dots.append(document.createElement('i'));
  $('log').append(dots);
  dots.scrollIntoView({ block: 'end' });
}
function hideTyping() { dots?.remove(); dots = null; }

// Read events until the agent is idle again. An idle from before this turn is ignored.
async function drain() {
  let started = false;
  for (;;) {
    await sleep(1000);
    const { data = [] } = await api(`/events?sid=${session.sid}&exp=${session.exp}&sig=${session.sig}`);
    for (const e of data) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      if (e.type === 'session.status_running' || e.type === 'agent.message') started = true;
      if (e.type === 'session.status_idle' && !started) continue;
      if (e.type === 'agent.message') { hideTyping(); add('agent', e.text); showTyping(); }
      else if (e.type === 'session.status_terminated') return;
      else if (e.type === 'session.status_idle') {
        if (e.requires_action) add('note', 'The agent is waiting on something it cannot get here.');
        return;
      }
    }
  }
}

// Turnstile token is single use: each start gets a fresh one.
function turnstileToken() {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    (function wait() {
      if (window.turnstile) {
        return window.turnstile.render('#ts', {
          sitekey: window.TURNSTILE_SITEKEY,
          callback: tok => { $('ts').replaceChildren(); resolve(tok); },
          'error-callback': () => reject(new Error('bot check failed')),
        });
      }
      if (Date.now() - t0 > 8000) return reject(new Error('bot check did not load'));
      setTimeout(wait, 200);
    })();
  });
}

async function start() {
  add('note', 'starting...');
  if (!session) session = await api('/session', { token: await turnstileToken() }); // reopen after an error reuses it
  showTyping();
  try { await drain(); } finally { hideTyping(); }
}

async function ask(text) {
  showTyping(); // right after the visitor's message, before the Worker answers
  try {
    await api('/send', { sid: session.sid, exp: session.exp, sig: session.sig, text });
    await drain();
  } finally { hideTyping(); }
}

$('form').addEventListener('submit', async ev => {
  ev.preventDefault();
  const text = $('msg').value.trim();
  if (!text) return;
  $('msg').value = '';
  $('go').disabled = true;
  add('user', text);
  try { await ask(text); }
  catch (err) { add('note', 'error: ' + err.message); }
  $('go').disabled = false;
  $('msg').focus();
});

// The run (and its cost) starts only when the visitor opens the chat, once.
let opened = false;
function openChat() {
  $('panel').classList.add('open');
  $('launch').style.display = 'none';
  if (opened) return;
  opened = true;
  $('go').disabled = true;
  start().catch(err => { opened = false; add('note', 'error: ' + err.message); })
         .finally(() => { $('go').disabled = !session; });
}
$('launch').addEventListener('click', openChat);
$('close').addEventListener('click', () => { $('panel').classList.remove('open'); $('launch').style.display = ''; });

// The hero button opens the same chat as the floating one.
document.getElementById('ask').addEventListener('click', ev => { ev.preventDefault(); openChat(); });
