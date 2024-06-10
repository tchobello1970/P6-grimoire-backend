// Importation du module multer pour la gestion des fichiers uploadés
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

// Définition des types MIME acceptés et de leurs extensions associées
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

// Configuration de multer pour le stockage des fichiers en mémoire
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, callback) => {
        const isValid = MIME_TYPES[file.mimetype];
        const error = isValid ? null : new Error('Invalid mime type');
        callback(error, isValid);
    }
}).single('image');

// Middleware combiné pour télécharger et convertir l'image en webp
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
        console.log('finalName');
        console.log(finalName);

        sharp(req.file.buffer)
            .webp({ quality: 80 })
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

/*
// Configuration de multer pour le stockage des fichiers sur le disque
const storage = multer.diskStorage({
    // Définition du dossier de destination pour les fichiers uploadés
    destination: (req, file, callback) => {
        console.log('Multer destination function called');
        callback(null, 'images');
    },
    // Définition du nom du fichier uploadé
    filename: (req, file, callback) => {
        console.log('Multer filename function called');
        // Remplacement des espaces par des underscores dans le nom du fichier original
        const name = file.originalname.split(' ').join('_').split('.')[0];
        // Récupération de l'extension du fichier à partir de son type MIME
        const extension = MIME_TYPES[file.mimetype];
        // Génération du nom final du fichier avec un timestamp pour éviter les conflits de nom
        if (!extension) {
            console.error('Invalid file type');
            return callback(new Error('Invalid file type'));
        }
        const finalName = name + Date.now() + '.webp';
        console.log('Generated filename:', finalName);

        callback(null, finalName);
    }
});


// Exportation du middleware multer configuré pour gérer un seul fichier avec le champ 'image'
module.exports = multer({ storage: storage }).single('image');
*/
