// Importation du module multer pour la gestion des fichiers uploadés
const multer = require('multer');

// Définition des types MIME acceptés et de leurs extensions associées
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

// Configuration de multer pour le stockage des fichiers sur le disque
const storage = multer.diskStorage({
    // Définition du dossier de destination pour les fichiers uploadés
    destination: (req, file, callback) => {
        console.log('Multer destination function called');
        callback(null, 'images');  // Correction de 'iamges' en 'images'
    },
    // Définition du nom du fichier uploadé
    filename: (req, file, callback) => {
        console.log('Multer filename function called');
        // Remplacement des espaces par des underscores dans le nom du fichier original
        const name = file.originalname.split(' ').join('_');
        // Récupération de l'extension du fichier à partir de son type MIME
        const extension = MIME_TYPES[file.mimetype];
        // Génération du nom final du fichier avec un timestamp pour éviter les conflits de nom
        if (!extension) {
            console.error('Invalid file type');
            return callback(new Error('Invalid file type'));
        }
        const finalName = name + Date.now() + '.' + extension;
        console.log('Generated filename:', finalName);
        callback(null, finalName);
    }
});

// Exportation du middleware multer configuré pour gérer un seul fichier avec le champ 'image'
module.exports = multer({ storage: storage }).single('image');
