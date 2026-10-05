# Session prep: build your portfolio agent

**Do this before 7 October. It takes about 45 minutes.**

On the day you publish your own portfolio page with an AI agent that tells visitors about you.
See the example: **[alvee1994.github.io/portfolio](https://alvee1994.github.io/portfolio/)**

No coding experience needed. Follow the steps in order. Where Mac and Windows differ, open only your own section.

---

## Checklist

| | Step | Time |
|---|---|---|
| ☐ | [1. GitHub account](#1-github-account) | 5 min |
| ☐ | [2. Cloudflare account](#2-cloudflare-account) | 5 min |
| ☐ | [3. Claude Console account and API key](#3-claude-console-account-and-api-key) | 10 min |
| ☐ | [4. Git and Node.js](#4-git-and-nodejs) | 15 min |
| ☐ | [5. An AI coding assistant (Claude Code or Codex)](#5-an-ai-coding-assistant) | 10 min |
| ☐ | [6. VS Code (optional)](#6-vs-code-optional) | 5 min |
| ☐ | [Final check](#final-check) | 2 min |

**You need:** a laptop (Windows 10+ or macOS 13+), the password you use to install software on it, and a bank card for a small credit.

---

## 1. GitHub account

GitHub stores your page and publishes it on the web for free.

1. Go to **[github.com/signup](https://github.com/signup)**.
2. Enter your email, a password and a **username**.
3. Solve the puzzle and enter the code GitHub emails you.
4. If asked about a plan, choose **Free**. Skip the survey questions.

> [!IMPORTANT]
> Your username becomes your web address: `https://<username>.github.io/portfolio`.
> Pick something professional, like `janedoe` or `jane-doe`.

✅ **Done when** you are signed in at github.com and see your picture in the top right corner.

---

## 2. Cloudflare account

Cloudflare runs the small program that keeps your AI key secret and blocks bots. Free plan. No domain needed.

1. Go to **[dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)**.
2. Sign up with the **same email as GitHub** and a password.
3. Open Cloudflare's email and click the link to **verify your address**.
4. If it asks you to add a domain or pick a plan, skip it or choose **Free**.
5. In the left menu, click **Workers & Pages** once. If asked for a subdomain, choose one close to your name.

> [!TIP]
> After your email is verified you can use **Sign in with GitHub** on the login page. One less password.

✅ **Done when** you can sign in at dash.cloudflare.com.

---

## 3. Claude Console account and API key

The Claude Console is where you build your agent and pay for what it uses. One visitor chat costs a few cents.

1. Go to **[platform.claude.com](https://platform.claude.com)** and sign up.
2. **Billing**: add a small credit, for example **$5**.
3. **Settings → Limits**: set a monthly spend limit, for example **$10**. Nobody can spend more than this on your account.
4. **Settings → API keys → Create key**. Name it `portfolio`.
5. Copy the key (starts with `sk-ant-`) into your password manager or a private note.

> [!WARNING]
> The key is shown **only once**, and it works like a bank card number.
> Never email it, paste it in a chat, a document or a GitHub file. In the session you paste it in one place only: Cloudflare.

✅ **Done when** your key is saved somewhere private and your spend limit is set.

---

## 4. Git and Node.js

The **terminal** is a window where you type commands instead of clicking. **Git** sends your page to GitHub. **Node.js** runs the tool that sends your code to Cloudflare. You install them once and never open them yourself.

**How to run a command:** copy it, paste it into the terminal, press **Enter**, and wait until the cursor comes back.

<details>
<summary><b>🍎 Mac</b> (click to open)</summary>

1. Open the terminal: press **Cmd + Space**, type `Terminal`, press **Enter**.
2. Check Git:
   ```
   git --version
   ```
   - Prints `git version 2.x`: Git is ready.
   - A pop-up offers **command line developer tools**: click **Install**, wait 5 to 10 minutes, run the command again.
3. Go to **[nodejs.org](https://nodejs.org)**, download the **LTS** version (`.pkg`), open it, click through with the defaults. It asks for your Mac password.
4. Quit Terminal (**Cmd + Q**) and open it again.
5. Check Node:
   ```
   node --version
   ```
   It should print `v22` or higher.

</details>

<details>
<summary><b>🪟 Windows</b> (click to open)</summary>

1. Download **Git for Windows** from **[git-scm.com/downloads/win](https://git-scm.com/downloads/win)**. Run it and click **Next** on every screen.
2. Download the **LTS** version of Node.js (`.msi`) from **[nodejs.org](https://nodejs.org)**. Run it with the defaults. Leave the box about **"tools for native modules" unticked**.
3. Open the terminal: click **Start**, type `PowerShell`, click **Windows PowerShell**. Do **not** pick "Run as administrator".
4. Let PowerShell run the tools you installed. Paste this, press Enter, type `Y` if asked:
   ```
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
   ```
5. Close PowerShell and open it again.
6. Check both:
   ```
   git --version
   node --version
   ```
   Node should be `v22` or higher.

</details>

> [!TIP]
> "Not recognized" or "command not found"? Close the terminal and open it again. Still failing? Restart the laptop.

---

## 5. An AI coding assistant

In the session an AI assistant edits your page and fixes errors for you in plain English. **Install one.** If you already pay for ChatGPT, Codex is the cheaper choice for you. Otherwise use Claude Code.

| | Claude Code | Codex |
|---|---|---|
| Made by | Anthropic | OpenAI |
| Log in with | Claude Console account (Step 3), or Claude Pro/Max | ChatGPT Plus/Pro, or an OpenAI API key |
| Free plan works? | No | Limited |

### Option A: Claude Code

<details>
<summary><b>🍎 Mac</b></summary>

```
curl -fsSL https://claude.ai/install.sh | bash
```
Quit Terminal (**Cmd + Q**) and open it again. If the installer printed a line about your PATH, run that line first.

</details>

<details>
<summary><b>🪟 Windows</b> (in PowerShell, not as administrator)</summary>

```
irm https://claude.ai/install.ps1 | iex
```
Close PowerShell and open it again.

> If you see `'irm' is not recognized`, you are in Command Prompt. Open **PowerShell** instead. Its prompt starts with `PS C:\`.

</details>

**Log in (both):**

1. Run `claude --version`. You should see something like `2.1.211 (Claude Code)`.
2. Run `claude`. Pick a colour theme, then log in with your **Anthropic Console** account. A browser opens: approve, then go back to the terminal.
3. Test it: type `What can you do?` and press Enter. Type `/exit` to leave.

### Option B: Codex

Works the same on Mac and Windows (needs Node.js from Step 4):

```
npm install -g @openai/codex
```

Then:

1. Run `codex --version`. It should print a version number.
2. Run `codex` and choose **Sign in with ChatGPT**. A browser opens: approve, then go back to the terminal.
3. Test it: type `What can you do?`. Press **Ctrl + C** to leave.

> [!NOTE]
> You still need the Claude Console account and API key from Step 3 even if you use Codex. That key powers your **agent**. Codex only helps you edit files.

---

## 6. VS Code (optional)

A free editor that shows your files, a terminal and your AI assistant in one window. Easier to follow along, but not required.

1. Download from **[code.visualstudio.com](https://code.visualstudio.com)**.
   - **Mac:** drag **Visual Studio Code** into **Applications**.
   - **Windows:** run the installer with the defaults. Tick **Add to PATH** if you see it.
2. Open VS Code. Click **Extensions** in the left bar (four squares icon).
3. Search and install **Claude Code** (by Anthropic) or **Codex** (by OpenAI), matching Step 5.
4. Open **Terminal → New Terminal** and run `claude --version` or `codex --version`.

---

## Final check

Open a **new** terminal and run each command:

| Command | You should see |
|---|---|
| `git --version` | `git version 2.` and more numbers |
| `node --version` | `v22` or higher |
| `npx --version` | a number, like `10.9.2` |
| `claude --version` **or** `codex --version` | a version number |

All four work? You are ready. 🎉

### Bring on the day

- [ ] Laptop, charged, plus charger
- [ ] GitHub, Cloudflare and Claude Console logins
- [ ] Your API key, saved privately
- [ ] A short bio and 3 to 5 facts visitors should learn about you

### Stuck?

Send Alvee a **screenshot of the terminal** and the **step number** before 6 October.
