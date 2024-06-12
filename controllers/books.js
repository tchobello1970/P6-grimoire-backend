const Book = require('../models/Book');
const fs = require('fs');


/* 
  extract all books from the database
*/
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};


/* 
  extract one book from the database matching the dynamic id from the url
*/
exports.getOneBook = (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
  
};

/*
  picks 3 books sorted by their average rating in reverse order
*/
exports.getBestRatings = (req, res, next) => {
  Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

/*
  book creation
    picks value from the json parsed request
    replace userId with the authentified one for more security
    build imageUrl
    save in DB
*/
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  delete bookObject.ratings;
  
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      ratings: [],
      averageRating: 0,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  
  book.save()
      .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
      .catch(error => { res.status(400).json( { error })})
}; 


/*
  modify book
    modify book entry in DB
    2 possibilities whether picture is modified or not.
    if modified, file is also removed from /images
*/
exports.modifyBook = (req, res, next) => {
  const updatedBook = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };

  delete updatedBook._userId;

  Book.findById(req.params.id)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: 'Unauthorized request' });
      }

      if (req.file) {
        const filename = book.imageUrl.split('/images/')[1];
        if (!filename) {
          return res.status(400).json({ message: 'Invalid filename' });
        }
        fs.unlink(`images/${filename}`, (err) => {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de la suppression du fichier' });
          }
        });
      }

      Book.updateOne({ _id: req.params.id }, { ...updatedBook, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié!' }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/*
  book deletion
    removes one book entry from DB
    file is also removed from /images
*/
exports.deleteBook = (req, res, next) => {
    Book.findById(req.params.id)
      .then(book => {
          if (!book) {
            return res.status(404).json({ message: 'Book not found' });
          }
          if (book.userId != req.auth.userId) {
              return res.status(401).json({message: 'Not authorized'});
          } 
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              Book.findByIdAndDelete(req.params.id)
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
          });
       })
      .catch( error => {
          res.status(500).json({ error });
      });
};

/*
  add Rating
    adds rating in DB
    updates averageRating entry
*/
exports.addRating = (req, res, next) => {
  Book.findById(req.params.id)
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      const userId = req.auth.userId;
      const userRating = parseInt(req.body.rating, 10);
      const existingRating = book.ratings.find(rating => rating.userId === userId);

      if (existingRating) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
      } 

      book.ratings.push({ userId: userId, grade: userRating });

      const totalRatings = book.ratings.length;
      const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
      book.averageRating = parseFloat(sumRatings / totalRatings).toFixed(2);

      book.save()
        .then(savedBook => res.status(200).json(savedBook))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};