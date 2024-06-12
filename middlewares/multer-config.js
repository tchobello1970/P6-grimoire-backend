const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const isValid = MIME_TYPES[file.mimetype];
        const error = isValid ? null : new Error('Invalid mime type');
        callback(error, isValid);
    }
}).single('image');

const multer_green = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return next(err);
        }

        if (!req.file) {
            return next();
        }

        const name = req.file.originalname.split(' ').join('_').split('.')[0];
        const finalName = `${name}_${Date.now()}.webp`;

        sharp(req.file.buffer)
            .webp({ quality: 80 })
            .resize({ width: 1024, height: 1024, fit: 'inside' })
            .toFile(`images/${finalName}`, (err, info) => {
                if (err) {
                    return next(err);
                }
                req.file.filename = finalName;
                req.file.path = `images/${finalName}`;
                next();
            });
    });
};

module.exports = multer_green;
