<div align="center">
  <img src="https://img.shields.io/badge/Status-Proprietary-red.svg" alt="Proprietary License">
  <img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/Playwright-Browser_Automation-blue.svg" alt="Playwright">
  <img src="https://img.shields.io/badge/Database-SQLite3-003B57.svg" alt="SQLite">
</div>

<br />

<div align="center">
  <h1>🚀 Autonomous LinkedIn Publisher (Multi-User)</h1>
  <p><em>A fully autonomous, multi-tenant AI system for drafting, illustrating, and publishing LinkedIn posts. Designed by Yosri Hamdouni (YosriSecOps).</em></p>
</div>

---

## 🌟 Overview / Présentation

**[EN]** The **Autonomous LinkedIn Publisher** is an enterprise-grade, multi-user service powered by the Antigravity environment. It allows multiple users to onboard via a Telegram Bot, define their professional persona, and let the AI fully manage their LinkedIn presence at **zero API cost**.

**[FR]** Le **Autonomous LinkedIn Publisher** est un service multi-utilisateurs de niveau entreprise, propulsé par l'environnement Antigravity. Il permet à plusieurs utilisateurs de s'inscrire via un bot Telegram, de définir leur persona professionnel et de laisser l'IA gérer entièrement leur présence sur LinkedIn avec **zéro coût d'API**.

The system autonomously / Le système de façon autonome :
1. 🧠 **Drafts personalized posts / Rédige des posts personnalisés**
2. 🎨 **Generates consistent images / Génère des images cohérentes**
3. 📱 **Requests human approval / Demande l'approbation humaine via Telegram**
4. 🌐 **Publishes automatically / Publie automatiquement via Playwright**

---

## ✨ Features / Fonctionnalités

- 👥 **Multi-Tenant Architecture**: Supports hundreds of users concurrently. / *Prend en charge des centaines d'utilisateurs simultanément.*
- 💬 **Conversational Onboarding**: Users text `/start` to the Telegram bot to build their AI profile interactively. / *Les utilisateurs envoient `/start` au bot pour créer leur profil.*
- 🎭 **Persona Matching**: Automatically adapts to each user's specific field (e.g., Cybersecurity) and tone. / *S'adapte au domaine (ex: Cybersécurité) et au ton de chaque utilisateur.*
- 📸 **Character Consistency**: Generates visual illustrations that consistently resemble the user. / *Génère des illustrations qui ressemblent à l'utilisateur.*
- 🔒 **Isolated Browser Sessions**: Stores Playwright session cookies in isolated folders (`browser-data/profile_<id>`) to prevent cross-account contamination. / *Sessions de navigateur isolées pour la sécurité.*
- ⚡ **On-Demand Content**: Provide a link and the AI writes a post about it! / *Fournissez un lien et l'IA écrit un post à ce sujet !*

---

## 🛠️ Setup & Installation / Installation

### 1. Prerequisites / Prérequis
- Node.js (v18 or higher)
- An active Telegram Bot (Create one via [@BotFather](https://t.me/BotFather))
- Antigravity Environment

### 2. Installation
Clone the repository and install dependencies / *Clonez le dépôt et installez les dépendances* :
```bash
npm install
```

### 3. Configuration
Copy the `.env.example` file to create your `.env` / *Créez votre fichier .env* :
```bash
cp .env.example .env
```
Open `.env` and paste your Telegram Bot Token:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### 4. Database Initialization / Initialisation de la Base de Données
Initialize the SQLite database schema:
```bash
npm run db:init
```

---

## 🚀 Running the Service / Lancement du Service

### Start the Telegram Gateway / Démarrer le Bot Telegram
Run the Telegram bot in the background. / *Lancez le bot en arrière-plan.*
```bash
npm run telegram:start
```

### Onboard Users / Inscription des Utilisateurs
1. Open Telegram and search for your bot.
2. Send the `/start` command.
3. The bot will interview you to capture your:
   - Field of Work/Study *(Domaine d'étude/travail)*
   - Preferred Tone *(Ton préféré)*
   - Visual Character Description *(Description visuelle)*
   - LinkedIn Credentials *(Identifiants LinkedIn sécurisés)*

**Available Bot Commands / Commandes Disponibles :**
- `/start` — Begin the onboarding process.
- `/field` — Change your active field or theme.
- `/connect` — Update your LinkedIn email or password.
- `/post [link/text]` — **On-Demand Generation:** Queue a request for the AI to generate a post immediately based on a link or topic! *(Générer un post à la demande à partir d'un lien)*

### Autonomous Publishing / Publication Autonome
The Antigravity agent uses the `.agents/skills/linkedin-publisher/SKILL.md` instruction set. Schedule the agent to run (e.g. every 15 minutes) to process the queue, draft content, and send drafts to Telegram for approval. 

---

## ⚖️ License & Contact

**⚠️ PROPRIETARY AND CONFIDENTIAL / PROPRIÉTAIRE ET CONFIDENTIEL**

This software is **NOT free** for commercial, personal, or public use. All rights are reserved. You may not reproduce, distribute, or run this code without explicit written permission from the author.

*Ce logiciel n'est pas gratuit. Tous les droits sont réservés. Vous ne pouvez pas reproduire, distribuer ou exécuter ce code sans l'autorisation écrite explicite de l'auteur.*

For business inquiries, usage licenses, or setup assistance, you **must contact the author directly**:

🔗 **[Yosri Hamdouni on LinkedIn](https://www.linkedin.com/in/hamdouni-yosri-06639a358)**
