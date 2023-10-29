const router = (require('express')).Router();
const { transporter, createOptions } = require('../utils/nodemailer');

router.post('/', async function (req, res) {
    const { subject, text, email, name } = req.body
    const options = createOptions({ name, email, subject, text });

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