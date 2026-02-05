import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'https://www.monparcourshandicap.gouv.fr/sites/default/files/2024-05/Formulaire-demande-MDPH_cerfa_15692-01.pdf';
const dest = path.join(__dirname, 'public', 'support_client.pdf');

console.log(`Downloading from ${url} to ${dest}...`);

const file = fs.createWriteStream(dest);

https.get(url, (response) => {
    if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('Download complete!');
            process.exit(0);
        });
    } else {
        console.error(`Failed to download: ${response.statusCode}`);
        process.exit(1);
    }
}).on('error', (err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
});
