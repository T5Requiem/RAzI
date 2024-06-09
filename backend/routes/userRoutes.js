var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');


router.get('/', userController.list);
router.get('/logout', userController.logout);
router.get('/:id', userController.show);

router.post('/', userController.create);
router.post('/login', userController.login);
router.post('/profile', userController.profile);
router.post('/favourite', userController.addFavourite);
router.post('/favourites', userController.getFavourite);

router.put('/:id', userController.update);

router.delete('/:id', userController.remove);

module.exports = router;
