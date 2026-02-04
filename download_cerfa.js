const https = require('https');
const fs = require('fs');

const url = 'https://www.monparcourshandicap.gouv.fr/sites/default/files/2023-09/Formulaire-demande-MDPH_cerfa_15692-01.pdf';
const path = './public/cerfa_15692.pdf';

if (!fs.existsSync('./public')) fs.mkdirSync('./public');

const file = fs.createWriteStream(path);
https.get(url, (response) => {
    if (response.statusCode !== 200) {
        console.error(`Failed to get '${url}' (${response.statusCode})`);
        return;
    }
    response.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('Download Completed');
    });
}).on('error', (err) => {
    console.error('Error: ' + err.message);
});
