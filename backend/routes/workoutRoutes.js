var express = require('express');
var router = express.Router();
var workoutController = require('../controllers/workoutController.js');


router.get('/', workoutController.list);
router.get('/:id', workoutController.show);

router.post('/', workoutController.create);
router.post('/workout', workoutController.findByWeather);

router.put('/:id', workoutController.update);

router.delete('/:id', workoutController.remove);

module.exports = router;
