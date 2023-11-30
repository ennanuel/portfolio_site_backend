const router = (require('express')).Router();
const { transporter, createOptions, validateMailValues, convertValuesArrayToObject } = require('../utils/nodemailer');

router.post('/', async function (req, res) {
    const mailContentArray = Object.entries(req.body);
    const { failed, message } = validateMailValues(mailContentArray);
    if (failed) return res.status(500).json({ message });
    const { name, email, subject, phone } = convertValuesArrayToObject(mailContentArray);
    const options = createOptions({ name, email, subject, phone });
    transporter.sendMail(options, (error, info) => {
        if(error) {
            console.log(error);
            return res.status(500).json({ success: false });
        } else {
            console.log(info.response);
            return res.status(200).json({ success: true });
        }
    })
})

module.exports = router;