const router = (require('express')).Router();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, getDoc, setDoc, updateDoc } = require('firebase/firestore');

const { uploadMiddleware, handleDelete } = require('../utils/upload');

const DEFAULT_PROJECT_DATA = {
    id: "",
    name: "",
    desc: "",
    code_link: "",
    demo_link: "",
    icon: "",
    images: [],
    stacks: [],
    is_github_link: true,
    is_main_project: true,
    rank: 0
}

initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
});
const database = getFirestore();
const projectsRef = collection(database, 'projects');

function authentication(req, res, next) {
    try {
        const { password } = req.cookies;
        if (password !== process.env.PASSWORD) throw new Error('Authentication failed');
        return next();
    } catch (error) {
        console.error(error);
        return res.render('auth', { error: true, success: false, message: error.message });
    }
}

router.get('/add', authentication, (req, res) => res.render('add'));

router.get('/:id', authentication, async function (req, res) {
    try {
        const { id } = req.params;
        const docReference = doc(database, 'projects', id);
        const projectDoc = await getDoc(docReference);

        if (!projectDoc) throw new Error("No project found!");

        const project = { ...DEFAULT_PROJECT_DATA, ...projectDoc.data(), id: projectDoc.id };

        return res.render('project', project);
    } catch (error) {
        console.error(error);
        return res.render('index', { error: true, success: false, message: error.message });
    }
});

router.get('/', async function (req, res) {
    try {
        const snapshots = await getDocs(projectsRef);
        const projectDocs = snapshots.docs.map((item) => ({ id: item.id, ...item.data() }));
        const projects = projectDocs.sort((projectA, projectB) => projectA.rank - projectB.rank);
        return res.status(200).json(projects);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
});

router.post('/upload', authentication, uploadMiddleware, async function (req, res) {
    try {
        const project = req.body;
        await addDoc(projectsRef, project);
        return res.render('index', { success: true, error: false, message: "Successfully uploaded project!" });
    } catch (error) {
        console.error(error);
        return res.render('index', { error: true, success: false, message: error.message });
    }
});

router.post('/edit/:id', authentication, uploadMiddleware, async function (req, res) {
    try {
        const { id } = req.params;
        const updatedProject = req.body;

        const projectDoc = doc(database, 'projects', id);
        await setDoc(projectDoc, updatedProject);
        
        return res.render('index', { success: true, error: false, message: "Project updated!" });
    } catch (error) {
        console.error(error);
        return res.render('index', { error: true, success: false, message: error.message });
    }
});

const updateProjecRank = (projectString) => new Promise(async function (resolve, reject) {
    try {
        const [id, rank] = projectString.split(/\s/);
        const projectRef = doc(database, 'projects', id)
        await updateDoc(projectRef, { rank });
        resolve();
    } catch (error) {
        reject(error);
    }
})

router.post('/update/rank', authentication, async function (req, res) {
    try {
        const { projects } = req.body;
        if (!projects?.length) throw new Error("Nothing to update");
        const projectsToUpdate = projects.map(updateProjecRank);
        await Promise.all(projectsToUpdate);
        return res.render('index', { error: false, success: true, message: 'Successfully updated project positions!' });
    } catch (error) {
        return res.render('index', { error: true, success: false, message: error.message });
    }
})

router.post('/delete/:id', authentication, async function (req, res) {
    try {
        const { id } = req.params;
        
        const docReference = doc(database, 'projects', id);
        const projectDoc = await getDoc(docReference);
        const project = { ...projectDoc.data() };

        await deleteDoc(docReference);

        const filesToDelete = [...project.images, project.icon].map(handleDelete);
        await Promise.all(filesToDelete);

        return res.render('index', { success: true, error: false, message: "Project deleted!" });
    } catch (error) {
        console.error(error);
        return res.render('index', { error: true, success: false, message: error.message });
    }
})

module.exports = router;