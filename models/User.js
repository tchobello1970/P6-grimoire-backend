const mongoose = require('mongoose');
// prevalidation to get better error messages than mongoDB ones.
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, 'Veuillez entrer une adresse e-mail valide'] // Validation du format d'e-mail
    },
    password: {
      type: String,
      required: true
    }
  });

userSchema.plugin(uniqueValidator);
  
module.exports = mongoose.model('User', userSchema);