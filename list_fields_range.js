import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function listFieldsRange() {
    try {
        const pdfBytes = fs.readFileSync('./public/form_standard.pdf');
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        console.log('--- FIELDS 50 TO 100 ---');
        fields.slice(50, 100).forEach((field, i) => {
            console.log(`${i + 50}: [${field.constructor.name}] : "${field.getName()}"`);
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

listFieldsRange();
