var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var locationSchema = new Schema({
	'long' : String,
	'lat' : String,
	'city' : String
});

var Location = mongoose.model('location', userSchema);
module.exports = Location;
