import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function checkPdf() {
    try {
        const pdfBytes = fs.readFileSync('./public/form_standard.pdf');
        const pdfDoc = await PDFDocument.load(pdfBytes);

        console.log('Title:', pdfDoc.getTitle());
        console.log('Author:', pdfDoc.getAuthor());
        console.log('Subject:', pdfDoc.getSubject());

        const form = pdfDoc.getForm();
        const fields = form.getFields();
        console.log('Total fields:', fields.length);

        console.log('--- FIRST 20 FIELDS ---');
        fields.slice(0, 20).forEach(field => {
            console.log(`[${field.constructor.name}] : "${field.getName()}"`);
        });
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkPdf();
