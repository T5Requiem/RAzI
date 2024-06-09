var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var workoutSchema = new Schema({
	'weatherDesc' : String,
    'workoutDesc' : String
});

var Workout = mongoose.model('workout', workoutSchema);
module.exports = Workout;
