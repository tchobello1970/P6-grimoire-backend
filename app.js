const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/stuff');

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB

mongoose.connect('mongodb+srv://victorhugo:victorhugo1802@books.uwcylgp.mongodb.net/vieuxgrimoire?retryWrites=true&w=majority&appName=books')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée !', error));

// Set headers to enable CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Define routes
app.use('/api/books', bookRoutes);

// Export the app module
module.exports = app;