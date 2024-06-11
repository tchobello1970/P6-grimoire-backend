const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: { type: String }, // - identifiant de l'utilisateur qui a créé le livre
    grade: { type: Number} // - note donnée à un livre
  });
  
const bookSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // - identifiant de l'utilisateur qui a créé le livre
  title: { type: String, required: true }, //- titre du livre
  author: { type: String, required: true }, // _ auteur du livre
  imageUrl: { type: String, required: true }, // - illustration/couverture du livre
  year: { type: Number, required: true }, // - année de publication du livre
  genre: { type: String, required: true }, // - genre du livre
  ratings: [ratingSchema],
  averageRating: { type: Number, default: 0 } //- note moyenne du livre
});

module.exports = mongoose.model('Book', bookSchema);