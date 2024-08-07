const express = require('express')
const dotenv = require('dotenv');;
const cors = require('cors');
const bp = require('body-parser');
const cookieParser = require('cookie-parser');


dotenv.config();

const mailRoute = require('./routes/mail');
const projectRoute = require('./routes/project');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(cookieParser());

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static('./views'));
app.use('/images', express.static('./images'));

app.get('/', (req, res) => res.render('index', { error: false, success: false, message: '' }));
app.post('/auth', (req, res) => {
    const { password } = req.body;
    if (password !== process.env.PASSWORD) return res.render('auth', { error: true, success: false, message: 'Incorrect passcode' });
    res.cookie('password', password);
    return res.render('index', { success: true, error: false, message: 'Welcome Emmanuel' });
});

app.use('/mail', mailRoute);
app.use('/project', projectRoute);

app.listen(process.env.PORT || 4000, () => {
    console.log('Server running on port %s', process.env.PORT)
})