import { Telegraf, session, Scenes } from 'telegraf';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { getProfileByChatId, upsertProfileByChatId, updateProfileField } from '../src/database/profiles.js';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Create scenes for conversational onboarding
const { BaseScene, Stage } = Scenes;

const onboardingScene = new BaseScene('onboarding');
onboardingScene.enter((ctx) => {
    ctx.session.step = 0;
    ctx.reply("Welcome to Autonomous LinkedIn Publisher! Let's set up your profile.\n\nFirst, what is your field of work or study? (e.g. Cybersecurity, Machine Learning, Digital Marketing)");
});

onboardingScene.on('text', async (ctx) => {
    const step = ctx.session.step;
    const text = ctx.message.text;
    const chatId = ctx.chat.id.toString();

    try {
        if (step === 0) {
            updateProfileField(chatId, 'theme', text);
            ctx.session.step++;
            await ctx.reply("Great! Next, what tone should your posts have? (e.g. Professional yet approachable, Academic, Conversational)");
        } else if (step === 1) {
            updateProfileField(chatId, 'tone', text);
            ctx.session.step++;
            await ctx.reply("Got it! Please provide a brief visual description of yourself for the AI image generation. (e.g. Confident woman in her 30s with short hair wearing a navy suit)");
        } else if (step === 2) {
            updateProfileField(chatId, 'character_description', text);
            ctx.session.step++;
            await ctx.reply("Awesome. Finally, to let me post on your behalf, I need your LinkedIn email address:");
        } else if (step === 3) {
            updateProfileField(chatId, 'linkedin_email', text);
            ctx.session.step++;
            await ctx.reply("Thanks. Now please provide your LinkedIn password. (For your safety, please delete your message after sending it!)");
        } else if (step === 4) {
            updateProfileField(chatId, 'linkedin_password', text);
            updateProfileField(chatId, 'onboarding_state', 'completed');
            ctx.session.step++;
            await ctx.reply("All set! Your profile is configured. The system will now automatically draft and generate content for you on a schedule.\n\nYou can use /field to change your theme or /connect to change your LinkedIn credentials at any time.");
            ctx.scene.leave();
        }
    } catch (e) {
        ctx.reply("An error occurred saving your profile: " + e.message);
        ctx.scene.leave();
    }
});

const fieldScene = new BaseScene('fieldUpdate');
fieldScene.enter((ctx) => {
    ctx.reply("What is your new field of work or study?");
});
fieldScene.on('text', async (ctx) => {
    updateProfileField(ctx.chat.id.toString(), 'theme', ctx.message.text);
    await ctx.reply("Your field has been updated!");
    ctx.scene.leave();
});

const connectScene = new BaseScene('connectUpdate');
connectScene.enter((ctx) => {
    ctx.session.step = 0;
    ctx.reply("Let's update your LinkedIn credentials. First, please provide your new LinkedIn email:");
});
connectScene.on('text', async (ctx) => {
    const step = ctx.session.step;
    const chatId = ctx.chat.id.toString();
    if (step === 0) {
        updateProfileField(chatId, 'linkedin_email', ctx.message.text);
        ctx.session.step++;
        await ctx.reply("Thanks. Now please provide your new LinkedIn password. (Remember to delete your message after sending)");
    } else {
        updateProfileField(chatId, 'linkedin_password', ctx.message.text);
        await ctx.reply("Credentials updated successfully!");
        ctx.scene.leave();
    }
});

const stage = new Stage([onboardingScene, fieldScene, connectScene]);

async function runBot() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!BOT_TOKEN) {
        console.error(JSON.stringify({ error: "Missing TELEGRAM_BOT_TOKEN in .env" }));
        process.exit(1);
    }

    const bot = new Telegraf(BOT_TOKEN);

    if (command === 'send-draft') {
        const postIdIndex = args.indexOf('--post-id');
        const textIndex = args.indexOf('--text');
        const imageIndex = args.indexOf('--image');
        const chatIdIndex = args.indexOf('--chat-id');

        const postId = args[postIdIndex + 1];
        const text = args[textIndex + 1];
        const image = imageIndex > -1 ? args[imageIndex + 1] : null;
        const chatId = chatIdIndex > -1 ? args[chatIdIndex + 1] : process.env.TELEGRAM_CHAT_ID;

        if (!chatId) {
             console.error(JSON.stringify({ error: "No chat ID provided" }));
             process.exit(1);
        }

        try {
            if (image && fs.existsSync(image)) {
                await bot.telegram.sendPhoto(chatId, { source: image }, { caption: `📝 New LinkedIn Draft (Post #${postId})` });
            }
            await bot.telegram.sendMessage(chatId, text, {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '✅ Approve', callback_data: `approve_${postId}` },
                            { text: '❌ Reject', callback_data: `reject_${postId}` }
                        ]
                    ]
                }
            });
            console.log(JSON.stringify({ success: true }));
        } catch (e) {
            console.error(JSON.stringify({ error: e.message }));
            process.exit(1);
        }
        process.exit(0);
    } 
    else if (command === 'check-approval') {
        const postIdIndex = args.indexOf('--post-id');
        const postId = args[postIdIndex + 1];
        const approvalPath = path.join(process.cwd(), `assets/generated/approval_${postId}.json`);
        
        if (fs.existsSync(approvalPath)) {
            const data = JSON.parse(fs.readFileSync(approvalPath, 'utf8'));
            console.log(JSON.stringify(data));
        } else {
            console.log(JSON.stringify({ status: 'pending' }));
        }
        process.exit(0);
    }
    else if (command === 'start') {
        bot.use(session());
        bot.use(stage.middleware());

        bot.command('start', async (ctx) => {
            const chatId = ctx.chat.id.toString();
            // Initialize basic profile in DB
            upsertProfileByChatId(chatId, { name: ctx.from.first_name });
            ctx.scene.enter('onboarding');
        });

        bot.command('field', (ctx) => {
            ctx.scene.enter('fieldUpdate');
        });

        bot.command('connect', (ctx) => {
            ctx.scene.enter('connectUpdate');
        });

        bot.on('callback_query', async (ctx) => {
            const data = ctx.callbackQuery.data;
            if (data.startsWith('approve_') || data.startsWith('reject_')) {
                const [action, postId] = data.split('_');
                const approvalPath = path.join(process.cwd(), `assets/generated/approval_${postId}.json`);
                fs.writeFileSync(approvalPath, JSON.stringify({
                    status: action === 'approve' ? 'approved' : 'rejected',
                    timestamp: new Date().toISOString()
                }));
                await ctx.answerCbQuery(`${action}d successfully`);
                await ctx.editMessageReplyMarkup({ inline_keyboard: [] }); // Remove buttons
            }
        });

        bot.launch();
        console.log("Telegram bot is running in long-polling mode...");

        // Enable graceful stop
        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));
    }
}

runBot();
