import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function findIdentityFields() {
    try {
        const pdfBytes = fs.readFileSync('./public/cerfa_15692.pdf');
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        const keywords = ['nom', 'prenom', 'famille', 'naissance', 'identit', 'usage'];

        console.log('--- SEARCHING FOR IDENTITY FIELDS ---');
        fields.forEach(field => {
            const name = field.getName().toLowerCase();
            if (keywords.some(k => name.includes(k))) {
                console.log(`[${field.constructor.name}] : "${field.getName()}"`);
            }
        });
        console.log('--- END OF SEARCH ---');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

findIdentityFields();
