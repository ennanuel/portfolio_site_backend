const multer = require('multer');
const DatauriParser = require('datauri/parser');
const cloudinary = require('./cloudinary');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const typeCheck = /image\/(png|jpg|jpeg|svg)/.test(file.mimetype);
        if (typeCheck) {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('File type not supported');
            err.name = 'ExtensionError'
            return cb(err);
        }
    }
}).fields([{ name: 'images', maxCount: 6 }, { name: 'icon', maxCount: 1 }])

const uploadToCloud = (file) => new Promise(
    async function (resolve, reject) {
        console.warn('uploading...');
        try {
            const { uploader } = cloudinary;
            const parser = new DatauriParser();
            const fileFormat = file.mimetype.split('/');
            const folder = getFolderName(file.fieldname);
            const { base64 } = parser.format(fileFormat[1], file.buffer);
            const { public_id, format } = await uploader.upload(`data:${file.mimetype};base64,${base64}`, { folder });
            const filename = `${public_id}.${format}`;
            resolve(filename);
        } catch (error) {
            console.error('upload failed');
            reject(error);
        }
    }
);

function getFolderName(fieldname) {
    return fieldname === 'icon' ? 'project_icons' : 'project_images';
}

function validateValues(values) {
    let failed = false, message = '';
    try {
        if (!values) throw new Error('There are no values');
        const valuesEntries = Object.entries(values);
        for (let [entry, value] of valuesEntries) {
            if (!value || value?.length < 1) throw new Error(`${entry} field cannot be empty!`);
        }
    } catch (error) {
        failed = true;
        message = error.message;
    }
    return { failed, message };
}

function handleError({err, failed, msg}) {
    let message = msg;
    if (err instanceof multer.MulterError) message = 'Error occured in multer';
    else if(!failed) message = err.message;
    const error = new Error(message);
    return error;
}

async function handleFilesUpload(files) {
    const fileFields = Object.entries(files);
    const result = { icon: [], images: [] };
    for (let [key, values] of fileFields) {
        if (values?.length < 1) continue;
        const filesToUpload = values.map(uploadToCloud);
        const uploadedFiles = await Promise.all(filesToUpload);
        result[key] = uploadedFiles;
    }
    return result;
};

function convertStringToBoolean(booleanString) {
    const stringToConvert = booleanString?.toLowerCase();
    if (!['true', 'false'].includes(stringToConvert)) return false;
    return stringToConvert === 'true';
}

function createProject(values) {
    let project;
    try {
        if (!values) throw new Error('No "value" argument found');
        project = { ...values };
        const { is_github_link, is_main_project, images = [], icon = [], stacks = [] } = project;
        project.is_github_link = convertStringToBoolean(is_github_link);
        project.is_main_project = convertStringToBoolean(is_main_project);
        project.icon = icon[0];
        project.images = images;
        project.stacks = stacks;
    } catch (error) {
        project = { error: error.message };
    }
    return project
};

function uploadMiddleware(req, res, next) {
    upload(req, res, async (err) => {
        try {
            const { files, body } = req;
            const { failed, message } = validateValues(body);
            if (err || failed) throw handleError({ err, failed, msg: message });
            const uploadedFiles = await handleFilesUpload(files);
            const { error, ...project } = createProject({ ...body, ...uploadedFiles });
            if (error) throw new Error(error);
            req.body = project;
            next()
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    })
}

module.exports = { validateValues, createProject, uploadMiddleware };