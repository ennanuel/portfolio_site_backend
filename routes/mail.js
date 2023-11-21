const router = (require('express')).Router();
const { transporter, createOptions } = require('../utils/nodemailer');

router.post('/', async function (req, res) {
    const { subject, email, phone, name } = req.body;
    if (!subject || !phone || !email || !name) return res.status(500).json({ message: 'Required fields cannot be empty ' });
    const options = createOptions({ name, email, subject, phone });
    transporter.sendMail(options, (error, info) => {
        if(error) {
            console.log(error)
            return res.status(500).json({success: false})
        } else {
            console.log(info.response)
            return res.status(200).json({success: true})
        }
    })
})

module.exports = router;