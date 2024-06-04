// Importation des modules nécessaires
const bcrypt = require('bcrypt');  // Bibliothèque pour le hachage des mots de passe
const jwt = require('jsonwebtoken');  // Bibliothèque pour la création et la vérification de JSON Web Tokens
const User = require('../models/User');  // Modèle utilisateur

// Fonction pour l'inscription d'un utilisateur
exports.signup = (req, res, next) => {
    // Hachage du mot de passe avec bcrypt (10 passages)
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // Création d'un nouvel utilisateur avec l'email et le mot de passe haché
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Sauvegarde de l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))  // Réponse de succès
          .catch(error => res.status(400).json({ error }));  // Réponse d'erreur en cas de problème de sauvegarde
      })
      .catch(error => res.status(500).json({ error }));  // Réponse d'erreur en cas de problème de hachage
};

// Fonction pour la connexion d'un utilisateur
exports.login = (req, res, next) => {
    // Recherche de l'utilisateur par email dans la base de données
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'utilisateur n'existe pas
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            // Comparaison du mot de passe fourni avec le mot de passe haché stocké
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si le mot de passe est incorrect
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // Si le mot de passe est correct, création d'un token JWT
                    res.status(200).json({
                        userId: user._id,  // ID de l'utilisateur
                        token: jwt.sign(
                            { userId: user._id },  // Payload du token
                            'RANDOM_TOKEN_SECRET',  // Clé secrète pour signer le token
                            { expiresIn: '24h' }  // Expiration du token
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));  // Réponse d'erreur en cas de problème de comparaison de mot de passe
        })
        .catch(error => res.status(500).json({ error }));  // Réponse d'erreur en cas de problème de recherche de l'utilisateur
};