import { publishToLinkedIn } from '../src/publisher/linkedin.js';
import path from 'path';

async function main() {
    const args = process.argv.slice(2);
    
    const profileIdIndex = args.indexOf('--profile-id');
    const textIndex = args.indexOf('--text');
    const imageIndex = args.indexOf('--image');

    if (profileIdIndex === -1 || textIndex === -1) {
        console.error(JSON.stringify({ error: "Missing required arguments. Usage: node linkedin-publisher.js --profile-id <id> --text <text> [--image <path>]" }));
        process.exit(1);
    }

    const profileId = args[profileIdIndex + 1];
    const text = args[textIndex + 1];
    let imagePath = null;

    if (imageIndex !== -1) {
        imagePath = path.resolve(process.cwd(), args[imageIndex + 1]);
    }

    try {
        const result = await publishToLinkedIn(profileId, text, imagePath);
        console.log(JSON.stringify(result));
        process.exit(0);
    } catch (error) {
        console.error(JSON.stringify({ error: error.message }));
        process.exit(1);
    }
}

main();
