import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function listFirstFields() {
    try {
        const pdfBytes = fs.readFileSync('./public/form_standard.pdf');
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        console.log('--- FIRST 50 FIELDS ---');
        fields.slice(0, 50).forEach((field, i) => {
            console.log(`${i}: [${field.constructor.name}] : "${field.getName()}"`);
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

listFirstFields();
