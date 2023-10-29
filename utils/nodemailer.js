const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const styling = `
    * { list-style: none; }
    h1 { font-weight: normal; }
    h2 span { font-weight: bold; }
    p { color: #151515; }
`;

const createOptions = ({ name, email, subject, text }) => ({
    from: process.env.EMAIL,
    to: 'emmanuelezema6@gmail.com',
    subject: `${subject} (${name})`,
    text: `From: ${name} - ${email}\n Message: ${text}`,
    html: `
            <html>
                <head>
                    <style>${styling}</style>
                </head>
                <h2>Message from <span>${text}</span> - <span>${email}</span></h2>
                <p>${text}<p>
            </html>
        `
});

module.exports = { transporter, createOptions }