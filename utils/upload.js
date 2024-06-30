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

async function handleDelete(file) {
    try {
        await cloudinary.uploader.destroy(file);
        console.log('%s deleted', file);
    } catch (error) {
        console.error(error);
    }
}

function getFolderName(fieldname) {
    return fieldname === 'icon' ? 'project_icons' : 'project_images';
}

function validateValues(values) {
    let failed = false, message = '';
    try {
        if (!values) throw new Error('There are no values');
        const valuesEntries = Object.entries(values);
        for (let [entry, value] of valuesEntries) {
            if (entry === 'images' || entry === 'icon') continue;
            else if (!value || value?.length < 1) throw new Error(`${entry} field cannot be empty!`);
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

async function handleFilesUpload(files, body) {
    const result = { icon: [], images: [], ...(files || {}) };

    for (let [key, values] of Object.entries(result)) {
        const oldValues = body[`old_${key}`] || [];

        if (values?.length < 1) {
            result[key] = oldValues;
            continue;
        }
        
        const filesToDelete = oldValues.map(handleDelete);
        const filesToUpload = values.map(uploadToCloud);
        const uploadedFiles = await Promise.all(filesToUpload);
        result[key] = uploadedFiles;

        if (oldValues.length > 0) await Promise.all(filesToDelete);
    }

    return result;
};

function convertStringToBoolean(booleanString) {
    const stringToConvert = booleanString?.toLowerCase();
    if (!/(true|false)/i.test(stringToConvert)) return false;
    return stringToConvert === 'true';
}

function createProject(values) {
    try {
        if (!values) throw new Error('No "value" argument found');
        const project = { ...values };
        const { is_github_link, is_main_project, images = [], icon = [], stacks = [] } = project;
        delete project.old_icon;
        delete project.old_images;
        project.is_github_link = convertStringToBoolean(is_github_link);
        project.is_main_project = convertStringToBoolean(is_main_project);
        project.icon = icon[0];
        project.images = images;
        project.stacks = stacks;
        project.rank = 0;
        return project;
    } catch (error) {
        throw error;
    }
};

function uploadMiddleware(req, res, next) {
    upload(req, res, async function (err) {
        try {
            const { files, body } = req;
            const { failed, message } = validateValues(body);

            if (err || failed) throw handleError({ err, failed, msg: message });

            const uploadedFiles = await handleFilesUpload(files, body);
            const project = createProject({ ...body, ...uploadedFiles });
            req.body = project;
            next()
        } catch (error) {
            console.error(error);
            return res.render('index', { error: true, success: false, message: error.message });
        }
    })
}

module.exports = { validateValues, createProject, uploadMiddleware, handleDelete };