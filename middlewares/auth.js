// Importation du module jsonwebtoken pour la vérification des tokens JWT
const jwt = require('jsonwebtoken');

// Middleware pour l'authentification des requêtes
module.exports = (req, res, next) => {
    try {
        // Récupération du token depuis l'en-tête Authorization
        const token = req.headers.authorization.split(' ')[1];
        // Vérification et décodage du token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Extraction de l'ID utilisateur du token décodé
        const userId = decodedToken.userId;
        // Ajout de l'ID utilisateur à l'objet req pour les prochains middlewares/handlers
        req.auth = { userId: userId };
        // Appel de next() pour passer au middleware suivant
        next();
    } catch (error) {
        // Réponse d'erreur en cas de problème de vérification du token
        res.status(401).json({ error });
    }
};