const router = (require('express')).Router();
const axios = require('axios');
const { uploadMiddleware } = require('../utils/upload');

router.get('/page/add', (req, res) => res.render('add'));
router.get('/page/edit', (req, res) => res.render('edit'));

router.get('/', async function (req, res) {
    try {
        const result = await axios.get(process.env.FIREBASE_DB_URL);
        const projects = result.data;
        return res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
});

router.post('/upload', uploadMiddleware, async function (req, res) {
    try {
        const project = req.body;
        const result = await axios.get(process.env.FIREBASE_DB_URL);
        const previousProjects = result.data || [];
        const newValues = [...previousProjects, project];
        await axios.put(process.env.FIREBASE_DB_URL, newValues);
        res.send('Project uploaded');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Could not upload project' });
    }
})

module.exports = router;