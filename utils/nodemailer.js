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

const createOptions = ({ name, email, subject }) => ({
    from: process.env.EMAIL,
    to: 'emmanuelezema6@gmail.com',
    subject: `${subject.length > 20 ? subject.substring(0, 20) + '...' : subject} (${name})`,
    text: `From: ${name} - ${email}`,
    html: `
            <html>
                <head>
                    <style>${styling}</style>
                </head>
                <h2>Message from <span>${name}</span> - <span>${email}</span></h2>
                <p>${subject}<p>
            </html>
        `
});

module.exports = { transporter, createOptions }