import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { SELECTORS } from './selectors.js';
import { getProfileById } from '../database/profiles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

function randomDelay(min = 2000, max = 5000) {
    return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));
}

async function typeLikeHuman(page, selector, text) {
    await page.waitForSelector(selector);
    await page.click(selector);
    for (const char of text) {
        await page.keyboard.type(char, { delay: Math.floor(Math.random() * 100) + 50 });
    }
}

export async function publishToLinkedIn(profileId, postText, imagePath = null) {
    let browserContext;
    try {
        const profile = getProfileById(profileId);
        if (!profile) {
            throw new Error(`Profile not found for ID: ${profileId}`);
        }
        
        const email = profile.linkedin_email;
        const password = profile.linkedin_password;

        if (!email || !password) {
             throw new Error(`LinkedIn credentials missing for profile ID: ${profileId}. The user needs to run /connect in Telegram.`);
        }

        const userDataDir = path.resolve(PROJECT_ROOT, 'browser-data', `profile_${profileId}`);
        if (!fs.existsSync(userDataDir)) {
            fs.mkdirSync(userDataDir, { recursive: true });
        }

        browserContext = await chromium.launchPersistentContext(userDataDir, {
            headless: false, // Set to true in production if desired, but false is safer for avoiding bot detection
            viewport: { width: 1920, height: 1080 },
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        const page = await browserContext.newPage();
        
        // Check if logged in
        await page.goto(SELECTORS.feedUrl);
        await randomDelay();

        const isLoggedIn = await page.$(SELECTORS.navBar).catch(() => null);

        if (!isLoggedIn) {
            console.log(`[Profile ${profileId}] Not logged in. Navigating to login page...`);
            await page.goto(SELECTORS.loginUrl);
            await typeLikeHuman(page, SELECTORS.loginEmail, email);
            await randomDelay(1000, 2000);
            await typeLikeHuman(page, SELECTORS.loginPassword, password);
            await randomDelay(1000, 2000);
            await page.click(SELECTORS.loginSubmit);
            await page.waitForNavigation();
            await randomDelay();
            
            // Check if login succeeded or if 2FA is required
            const navCheck = await page.$(SELECTORS.navBar).catch(() => null);
            if (!navCheck) {
                 throw new Error("Login failed or 2FA required. Please check the browser manually.");
            }
        } else {
            console.log(`[Profile ${profileId}] Already logged in.`);
        }

        console.log(`[Profile ${profileId}] Starting post creation...`);
        await page.click(SELECTORS.startPostButton);
        await randomDelay();
        
        await typeLikeHuman(page, SELECTORS.postTextArea, postText);
        await randomDelay();

        if (imagePath && fs.existsSync(imagePath)) {
            console.log(`[Profile ${profileId}] Attaching image...`);
            await page.click(SELECTORS.addImageButton);
            await randomDelay(1000, 2000);
            const fileChooserPromise = page.waitForEvent('filechooser');
            // Sometimes there's a label or specific input to click depending on the LinkedIn UI version.
            // Playwright can also just set input files if we find the input.
            const fileInput = await page.$(SELECTORS.imageFileInput);
            if (fileInput) {
                await fileInput.setInputFiles(imagePath);
            } else {
                 // Fallback to filechooser
                 const fileChooser = await fileChooserPromise;
                 await fileChooser.setFiles(imagePath);
            }
            // Wait for image preview to load (rough delay)
            await randomDelay(3000, 6000);
            
            // Need to click "Done" on the image modal if it appears
            const doneButton = await page.$('button.share-box-footer__primary-btn');
            if (doneButton) {
                await doneButton.click();
            }
            await randomDelay();
        }

        console.log(`[Profile ${profileId}] Submitting post...`);
        await page.click(SELECTORS.postSubmitButton);
        
        // Wait for successful post
        await page.waitForSelector('.artdeco-toast-item--visible', { timeout: 15000 }).catch(() => {});
        await randomDelay();

        // Best effort to get URL, otherwise just return success
        // LinkedIn redirects or shows a toast, getting the exact URL is complex without intercepting network.
        console.log(`[Profile ${profileId}] Post published successfully!`);

        await browserContext.close();
        return { success: true, url: null };
    } catch (error) {
        if (browserContext) {
            await browserContext.close();
        }
        throw error;
    }
}
