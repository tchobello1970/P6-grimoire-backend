const Book = require('../models/Book');
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
  
};

exports.getBestRatings = (req, res, next) => {
  Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};


exports.createBook = (req, res, next) => {
  // on récupère les données du body et on supprime ce qui est inutile.
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  delete bookObject.ratings;
  
  //on créé une instance du modèle. On intègre avec le spread operator et on ajoute les champs manquants.
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      ratings: [],
      averageRating: 0,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  //on sauvegarde dans la base et ça retourne un promise.
  book.save()
  .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};


exports.modifyBook = (req, res, next) => {
  const updatedBook = req.file ? {
      ...JSON.parse(req.body.thing),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete updatedBook._userId;
  Book.findById(req.params.id)
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(403).json({ message : 'unauthorized Request'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...updatedBook, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Livre modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteBook = (req, res, next) => {
    Book.findById(req.params.id)
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Book.findByIdAndDelete(req.params.id)
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};


exports.addRating = (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      const userId = req.auth.userId;
      const userRating = parseInt(req.body.rating, 10);

      // Vérifiez si l'utilisateur a déjà noté le livre
      const existingRating = book.ratings.find(rating => rating.userId === userId);

      if (existingRating) {
        // Renvoie une erreur si l'utilisateur a déjà noté le livre
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
      } else {
        // Ajouter une nouvelle note
        book.ratings.push({ userId: userId, grade: userRating });
      }

      // Recalculer la note moyenne
      const totalRatings = book.ratings.length;
      const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
      book.averageRating = parseFloat(sumRatings / totalRatings).toFixed(2);

      // Enregistrer les modifications et renvoyer le livre complet
      book.save()
        .then(savedBook => res.status(200).json(savedBook))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};