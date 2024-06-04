const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    email: {
      type: String, // - adresse e-mail de l’utilisateur [unique]
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Veuillez entrer une adresse e-mail valide'] // Validation du format d'e-mail
    },
    password: { // - mot de passe haché de l’utilisateur
      type: String,
      required: true
    }
  });

userSchema.plugin(uniqueValidator);
  
module.exports = mongoose.model('User', userSchema);