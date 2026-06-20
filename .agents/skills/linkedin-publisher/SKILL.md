---
name: linkedin-publisher
description: Autonomously generates and publishes LinkedIn posts for multiple profiles. Handles content drafting, image generation, human approval via Telegram, and automated posting via Playwright.
---

### Overview
This skill operates the Autonomous LinkedIn Publisher for all onboarded users.

### Prerequisites
- The project must be set up at `c:\Users\yhamd\OneDrive\Desktop\Autonomous LinkedIn Publisher`
- Telegram bot running in background: `npm run telegram:start`

### Execution Sequence

**Step 1: Read Active Profiles**
Run: `node scripts/db-manager.js get-active-profiles`
Parse the JSON output.

**Step 2: For Each Active Profile**
For each profile in the list:

**Step 2a: Get Past Topics**
Run: `node scripts/db-manager.js get-recent-topics --profile-id <id> --limit 20`

**Step 2b: Draft the Post**
Generate a LinkedIn post:
- Theme: [profile.theme]
- Tone: [profile.tone]
- Must NOT cover any of the past topics
- Length: 150-300 words
- Output JSON: { "topic": "...", "postText": "...", "imagePrompt": "..." }

**Step 2c: Generate the Image**
Enhance imagePrompt using the constraints:
- Character: [profile.character_description]
- Eyes, nose, mouth clearly visible
- Background: [profile.background_setting]
- Maintain exact same character design, dress, and styling
- Professional LinkedIn illustration style

Use `generate_image` tool. Note the image path.

**Step 2d: Save Draft to Database**
Run: `node scripts/db-manager.js insert-draft --profile-id <id> --topic "<topic>" --text "<postText>" --image-prompt "<imagePrompt>" --image-path "<imagePath>"`
Note the returned post ID.

**Step 2e: Send for Approval**
Run: `node scripts/telegram-bot.js send-draft --post-id <id> --chat-id <profile.telegram_chat_id> --text "<postText>" --image "<imagePath>"`
Check status periodically: `node scripts/telegram-bot.js check-approval --post-id <id>`
Wait until "approved" or "rejected".

**Step 2f: If Approved — Publish**
Run: `node scripts/linkedin-publisher.js --profile-id <id> --text "<postText>" --image "<imagePath>"`

**Step 2g: Log the Result**
If published successfully:
Run: `node scripts/db-manager.js mark-published --post-id <id> --url "<url>"`

If rejected:
Run: `node scripts/db-manager.js update-status --post-id <id> --status rejected`
