import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function debugFields() {
    try {
        const pdfBytes = fs.readFileSync('./public/cerfa_15692.pdf');
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        console.log('Total fields:', fields.length);

        // Look for fields that might be on page 1 or 2 for identity
        const identityKeywords = ['nom', 'prenom', 'prén', 'famille', 'naissance', 'identit', 'usage', 'p2', 'p3'];

        const matches = fields.filter(f => {
            const name = f.getName().toLowerCase();
            return identityKeywords.some(k => name.includes(k));
        });

        console.log('--- POTENTIAL IDENTITY FIELDS ---');
        matches.forEach(f => {
            console.log(`- "${f.getName()}" (Type: ${f.constructor.name})`);
        });

    } catch (err) {
        console.error('Error:', err.message);
    }
}

debugFields();
