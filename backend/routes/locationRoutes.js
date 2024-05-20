var express = require('express');
var router = express.Router();
var locationController = require('../controllers/locationController.js');


router.get('/', locationController.list);
router.get('/:id', locationController.show);

router.post('/', locationController.create);

router.put('/:id', locationController.update);

router.delete('/:id', locationController.remove);

module.exports = router;
