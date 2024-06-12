const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');

//Express App is created
const app = express();

// Middleware to parse JSON requests that are in Body
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://victorhugo:victorhugo1802@books.uwcylgp.mongodb.net/vieuxgrimoire?retryWrites=true&w=majority&appName=books')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée !', error));

// Set headers to enable CORS, nécessaire quand les deux serveurs sont différents.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Middleware pour définir les Routes utilisées pour les requêtes commençant par le premier argument.
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Middleware pour servir des fichiers statiques (images) avec multer
app.use('/images', express.static(path.join(__dirname, 'images')));

// Export the app module
module.exports = app;