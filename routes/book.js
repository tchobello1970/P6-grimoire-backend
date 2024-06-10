const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');

const multer_green = require('../middlewares/multer-config');

const bookCtrl = require('../controllers/books');

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, multer_green, bookCtrl.createBook);
router.put('/:id', auth, multer_green, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;