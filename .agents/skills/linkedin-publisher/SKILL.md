---
name: linkedin-publisher
description: Autonomously generates and publishes LinkedIn posts for multiple profiles based on a queue of on-demand requests. Handles content drafting from links, image generation, human approval via Telegram, and automated posting via Playwright.
---

### Overview
This skill operates the Autonomous LinkedIn Publisher for all onboarded users. It processes the queue of pending requests made by users via Telegram.

### Prerequisites
- The project must be set up at `c:\Users\yhamd\OneDrive\Desktop\Autonomous LinkedIn Publisher`
- Telegram bot running in background: `npm run telegram:start`

### Execution Sequence

**Step 1: Get Pending Requests**
Run: `node scripts/db-manager.js get-pending-requests`
Parse the JSON output. If the array is empty, your work is done for now.

**Step 2: Process Each Request**
For each pending request in the list:

**Step 2a: Mark Processing**
Run: `node scripts/db-manager.js update-request-status --request-id <request.id> --status processing`

**Step 2b: Read the Source (if provided)**
Check `request.source_content`. 
- If it's a URL (e.g. GitHub, article), use your web browsing / reading tools to fetch the content of the link.
- If it's plain text, read the text.
- If it's `null`, perform a web search for recent trending news/topics in the user's field (`request.theme`).

**Step 2c: Draft the Post**
Generate a LinkedIn post:
- Theme: [request.theme]
- Tone: [request.tone]
- Content: Based entirely on the `source_content` or your web search from Step 2b.
- Length: 150-300 words
- Output JSON: { "topic": "...", "postText": "...", "imagePrompt": "..." }

**Step 2d: Generate the Image**
Enhance imagePrompt using the constraints:
- Character: [request.character_description]
- Eyes, nose, mouth clearly visible
- Background: [request.background_setting]
- Maintain exact same character design, dress, and styling
- Professional LinkedIn illustration style

Use `generate_image` tool. Note the image path.

**Step 2e: Save Draft to Database**
Run: `node scripts/db-manager.js insert-draft --profile-id <request.profile_id> --topic "<topic>" --text "<postText>" --image-prompt "<imagePrompt>" --image-path "<imagePath>"`
Note the returned post ID.

**Step 2f: Send for Approval**
Run: `node scripts/telegram-bot.js send-draft --post-id <id> --chat-id <request.telegram_chat_id> --text "<postText>" --image "<imagePath>"`
Check status periodically: `node scripts/telegram-bot.js check-approval --post-id <id>`
Wait until "approved" or "rejected".

**Step 2g: Publish and Cleanup**
If approved:
Run: `node scripts/linkedin-publisher.js --profile-id <request.profile_id> --text "<postText>" --image "<imagePath>"`
Run: `node scripts/db-manager.js mark-published --post-id <id> --url "<url>"`

If rejected:
Run: `node scripts/db-manager.js update-status --post-id <id> --status rejected`

Finally, mark the request as completed:
Run: `node scripts/db-manager.js update-request-status --request-id <request.id> --status completed`
