const fs = require('fs');
const https = require('https');
const path = require('path');

const setlistsPath = 'c:\\Users\\rlack\\setlists_sync.json';
const outputDir = 'c:\\Users\\rlack';

async function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function main() {
    const setlists = JSON.parse(fs.readFileSync(setlistsPath, 'utf8'));
    console.log(`Found ${setlists.length} setlists to fetch.`);

    for (const setlist of setlists) {
        const url = `https://www.vynl.pro/api/setlists/${setlist.id}`;
        const outputPath = path.join(outputDir, `setlist_${setlist.id}.json`);
        console.log(`Fetching ${setlist.name} (${setlist.id})...`);
        try {
            const data = await fetchUrl(url);
            fs.writeFileSync(outputPath, data);
            console.log(`Saved to ${outputPath}`);
        } catch (error) {
            console.error(`Failed to fetch ${setlist.id}:`, error.message);
        }
    }
}

main().catch(console.error);
