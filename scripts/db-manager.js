import db from '../src/database/connection.js';
import { getActiveProfiles, getProfileById, getProfileByChatId } from '../src/database/profiles.js';
import { getRecentTopics, insertDraft, updateStatus, markPublished } from '../src/database/postHistory.js';

function parseArgs() {
    const args = process.argv.slice(2);
    const command = args[0];
    const params = {};
    
    for (let i = 1; i < args.length; i += 2) {
        if (args[i].startsWith('--')) {
            const key = args[i].substring(2).replace(/-([a-z])/g, g => g[1].toUpperCase());
            params[key] = args[i + 1];
        }
    }
    
    return { command, params };
}

async function main() {
    try {
        const { command, params } = parseArgs();
        
        switch (command) {
            case 'init':
                console.log(JSON.stringify({ success: true, message: 'Database initialized.' }));
                break;
            case 'get-active-profiles':
                console.log(JSON.stringify(getActiveProfiles()));
                break;
            case 'get-profile':
                if (params.id) {
                    console.log(JSON.stringify(getProfileById(params.id)));
                } else if (params.chatId) {
                    console.log(JSON.stringify(getProfileByChatId(params.chatId)));
                }
                break;
            case 'get-recent-topics':
                console.log(JSON.stringify(getRecentTopics(params.profileId, params.limit || 20)));
                break;
            case 'insert-draft':
                const id = insertDraft(
                    params.profileId, 
                    params.topic, 
                    params.text, 
                    params.imagePrompt, 
                    params.imagePath
                );
                console.log(JSON.stringify({ id }));
                break;
            case 'update-status':
                updateStatus(params.postId, params.status);
                console.log(JSON.stringify({ success: true }));
                break;
            case 'mark-published':
                markPublished(params.postId, params.url);
                console.log(JSON.stringify({ success: true }));
                break;
            default:
                throw new Error(`Unknown command: ${command}`);
        }
    } catch (error) {
        console.error(JSON.stringify({ error: error.message }));
        process.exit(1);
    }
}

main();
