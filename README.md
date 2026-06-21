<div align="center">
  <img src="https://img.shields.io/badge/Status-Proprietary-red.svg" alt="Proprietary License">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/Playwright-Browser_Automation-blue.svg" alt="Playwright">
  <img src="https://img.shields.io/badge/Database-SQLite3-003B57.svg" alt="SQLite">
</div>

<br />

<div align="center">
  <h1>🚀 Autonomous LinkedIn Publisher (Multi-User)</h1>
  <p><em>A fully autonomous, multi-tenant AI system for drafting, illustrating, and publishing LinkedIn posts.</em></p>
</div>

---

## 🌟 Overview

The **Autonomous LinkedIn Publisher** is an enterprise-grade, multi-user service powered by the Antigravity environment. It allows multiple users to onboard via a Telegram Bot, define their professional persona, and let the AI fully manage their LinkedIn presence at **zero API cost**.

The system autonomously:
1. 🧠 **Drafts personalized posts** using built-in AI, ensuring it never repeats topics.
2. 🎨 **Generates consistent images** of the user based on their visual description.
3. 📱 **Requests human approval** via an interactive Telegram bot.
4. 🌐 **Publishes automatically** using isolated Playwright browser sessions.

---

## ✨ Features

- 👥 **Multi-Tenant Architecture**: Supports hundreds of users concurrently.
- 💬 **Conversational Onboarding**: Users text `/start` to the Telegram bot to build their AI profile interactively.
- 🎭 **Persona Matching**: Automatically adapts to each user's specific field (e.g., Cybersecurity, Data Science) and tone.
- 📸 **Character Consistency**: Generates visual illustrations that consistently resemble the user.
- 🔒 **Isolated Browser Sessions**: Stores Playwright session cookies in isolated folders (`browser-data/profile_<id>`) to prevent cross-account contamination and avoid 2FA friction.
- 💸 **Zero Cost**: Relies entirely on Antigravity's native tools, requiring absolutely no paid API keys.

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- Node.js (v18 or higher)
- An active Telegram Bot (Create one via [@BotFather](https://t.me/BotFather))
- Antigravity Environment

### 2. Installation

Clone the repository and install dependencies:
```bash
npm install
```

### 3. Configuration
Copy the `.env.example` file to create your `.env`:
```bash
cp .env.example .env
```
Open `.env` and paste your Telegram Bot Token:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### 4. Database Initialization
Initialize the SQLite database schema:
```bash
npm run db:init
```

---

## 🚀 Running the Service

### Start the Telegram Gateway
Run the Telegram bot in the background. This service listens for user interactions and onboarding requests:
```bash
npm run telegram:start
```

### Onboard Users
1. Open Telegram and search for your bot.
2. Send the `/start` command.
3. The bot will interview you to capture your:
   - Field of Work/Study
   - Preferred Tone
   - Visual Character Description
   - LinkedIn Credentials (securely stored in SQLite)

**Available Bot Commands:**
- `/start` — Begin the onboarding process.
- `/field` — Change your active field or theme.
- `/connect` — Update your LinkedIn email or password.

### On-Demand Publishing
The system is now driven by your requests! 
1. Send `/post https://github.com/...` or `/post Check out this article...` to the bot.
2. The bot will queue your request.
3. The Antigravity agent runs the `linkedin-publisher` skill on a schedule (e.g. every 15 minutes). It will read your queued links, draft the content, and send you the generated post and image for approval.
4. Click ✅ Approve to publish!

---

## ⚖️ License & Contact

**⚠️ PROPRIETARY AND CONFIDENTIAL**

This software is **NOT free** for commercial, personal, or public use. All rights are reserved. You may not reproduce, distribute, or run this code without explicit written permission from the author.

For business inquiries, usage licenses, or setup assistance, you **must contact the author directly**:

🔗 **[Yosri Hamdouni on LinkedIn](https://www.linkedin.com/in/hamdouni-yosri)**
