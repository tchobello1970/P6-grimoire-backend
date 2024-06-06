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


/*exports.createBook = (req, res, next) => {
  console.log('req.file:', req.file);  // Journalisation pour vérifier req.file
  console.log('req.body:', req.body);  // Journalisation pour vérifier req.body

  const newBook = new Book({
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
    averageRating: req.body.grade
  });
  newBook.save()
    .then(() => res.status(201).json({ message: 'Post saved successfully!' }))
    .catch(error => res.status(400).json({ error }));
};*/


exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
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