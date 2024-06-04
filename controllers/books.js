const Book = require('../models/Book');

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


  exports.createBook = (req, res, next) => {
  const book = new Book({
    userId: req.body.userId,
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    genre: req.body.genre,
    ratings: [{
      userId: req.body.userId,
      grade: req.body.grade
  }],
    averageRating: averageRating
  });
  book.save()
    .then(() => res.status(201).json({ message: 'Post saved successfully!' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const updatedBook = new Book({
    userId: req.body.userId,
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    genre: req.body.genre,
    ratings: [{
      userId: req.body.userId,
      grade: req.body.grade
  }],
    averageRating: averageRating
  });
  Book.findByIdAndUpdate(req.params.id, updatedBook)
    .then(() => res.status(200).json({ message: 'Book updated successfully!' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({ message: 'Deleted!' }))
    .catch(error => res.status(400).json({ error }));
};