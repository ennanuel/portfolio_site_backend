const express = require('express')
const dotenv = require('dotenv');;
const cors = require('cors');
const bp = require('body-parser');
dotenv.config();

const mailRoute = require('./routes/mail');
const projectRoute = require('./routes/project');

const app = express();

app.use(cors({ origin: 'http://127.0.0.1:5173' }));

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(express.static('./views'));

app.set('view engine', 'ejs');
app.use('/images', express.static('./images'));

app.use('/mail', mailRoute);
app.use('/project', projectRoute)

app.listen(process.env.PORT || 4000, () => {
    console.log('Server running on port %s', process.env.PORT)
})