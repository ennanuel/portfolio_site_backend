const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const MAIL_STYLING = '* { list-style: none; } h1 { font-weight: normal; } h2 span { font-weight: bold; } p { color: #151515; }';

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

function validateMailValues(valuesArray) {
    let failed = false, message = '';
    try {
        if (!valuesArray) throw new Error('No values array found');
        for (let [key, value] of valuesArray) {
            if (!value || value?.length < 1) throw new Error(`${key} field cannot be left empty`);
        }
    } catch (error) {
        message = error.message;
        failed = true;
    }
    return { failed, message };
};

function convertValuesArrayToObject(objectEntries) {
    let newMailValues = {};
    for (let entry of objectEntries) {
        if (entry?.length !== 2) continue;
        let [key, value] = entry;
        if (typeof value !== 'string') newMailValues[key] = JSON.stringify(value);
        else newMailValues[key] = value;
    }
    return newMailValues;
}

function createOptions({ name, email, subject }) {
    if (!name || !email || !subject) return null;
    return {
            from: process.env.EMAIL,
            to: 'emmanuelezema6@gmail.com',
            subject: `${subject.length > 20 ? subject.substring(0, 20) + '...' : subject} (${name})`,
            text: `From: ${name} - ${email}`,
            html: `
            <html>
                <head>
                    <style>${MAIL_STYLING}</style>
                </head>
                <h2>Message from <span>${name}</span> - <span>${email}</span></h2>
                <p>${subject}<p>
            </html>
        `
    }
}

module.exports = { transporter, validateMailValues, convertValuesArrayToObject, createOptions }