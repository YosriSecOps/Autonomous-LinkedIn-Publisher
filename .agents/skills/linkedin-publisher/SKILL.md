---
name: linkedin-publisher
description: Autonomously generates and publishes LinkedIn posts for multiple profiles based on a queue of on-demand requests. Handles content drafting from links, image generation, human approval via Telegram, and automated posting via Playwright.
---

### Overview
This skill operates the Autonomous LinkedIn Publisher for all onboarded users. It processes the queue of pending requests made by users via Telegram.

### Quick Start
When the user says "start the linkedin publisher", "turn on the schedule", or "run the linkedin-publisher skill", do the following:
1. **Ensure the Telegram bot is running.** Check if `npm run telegram:start` is already running. If not, start it in the background.
2. **Start the Queue Monitor.** Set a recurring cron schedule (`* * * * *` = every 1 minute) that runs the Execution Sequence below. This is the heartbeat of the system.
3. **Report back.** Confirm to the user that the system is live.

### Stopping
When the user says "stop the schedule" or "pause the publisher", kill the cron task. Do NOT kill the Telegram bot (it should keep running for onboarding).

### Prerequisites
- The project is at `c:\Users\yhamd\OneDrive\Desktop\Autonomous LinkedIn Publisher`
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
- If it's a URL (e.g. GitHub, article, video link), use your web browsing / reading tools to fetch and understand the content of the link.
- If it's plain text, read the text.
- If it's `null`, perform a web search for recent trending news/topics in the user's field (`request.theme`).

**Step 2c: Draft the Post**
Generate a LinkedIn post. This is the most critical step. The post MUST sound like a real human wrote it, NOT like AI.

**Writing Rules (MANDATORY):**
- Write in FIRST PERSON. You are this person. Use "I", "my", "we".
- Share a PERSONAL OPINION or TAKE on the topic. Don't just list facts. Say what you think, why it matters to you, and what you'd recommend.
- Use STORYTELLING when possible. Start with a hook: a question, a bold statement, a personal anecdote, or a surprising fact.
- Include the "how", "why", "when", and "where" — don't just state what something is.
- Add a CALL TO ACTION at the end (ask a question, invite discussion).
- Use a CONVERSATIONAL tone matching `request.tone`. Write like you're talking to a colleague over coffee.
- Avoid generic AI phrases like "In today's rapidly evolving landscape", "Let's dive in", "Here's the thing", "Game-changer", "Groundbreaking".
- Do NOT use excessive emojis. Maximum 2-3 per post, placed naturally.
- Length: 150-250 words. Short paragraphs. Line breaks between ideas.
- Include 3-5 relevant hashtags at the very end.

**Bad example (AI-sounding):**
"In today's rapidly evolving cybersecurity landscape, organizations must adapt to the growing threat of AI-powered attacks. Here are 5 key trends to watch..."

**Good example (Human-sounding):**
"I spent the last week analyzing the FortiBleed breach that hit 86,000 devices — and honestly, it shook me. We keep buying firewalls and VPNs thinking they'll protect us, but what happens when the security tool itself becomes the attack surface? Here's what I think we're getting wrong..."

Output JSON: { "topic": "...", "postText": "...", "imagePrompt": "..." }

**Step 2d: Generate the Image (ONLY if request.include_image is 1)**
Check `request.include_image`:
- If `0`: Skip image generation entirely. Set imagePath to null.
- If `1`: Generate an image about THE TOPIC of the post, NOT about the user.

Image prompt rules:
- The image should visually represent the CONCEPT or THEME of the post.
- Examples: a shield with a cracked lock for a cybersecurity breach post, a network of connected nodes for a cloud computing post, a person standing at a crossroads for a career decision post.
- Do NOT generate portraits or images of the user.
- Keep the style professional, clean, and modern — suitable for LinkedIn.

Use `generate_image` tool. Note the image path.

**Step 2e: Save Draft to Database**
Run: `node scripts/db-manager.js insert-draft --profile-id <request.profile_id> --topic "<topic>" --text "<postText>" --image-prompt "<imagePrompt>" --image-path "<imagePath>"`
Note the returned post ID.

**Step 2f: Send for Approval**
If there is an image:
Run: `node scripts/telegram-bot.js send-draft --post-id <id> --chat-id <request.telegram_chat_id> --text "<postText>" --image "<imagePath>"`

If text-only (no image):
Run: `node scripts/telegram-bot.js send-draft --post-id <id> --chat-id <request.telegram_chat_id> --text "<postText>"`

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
