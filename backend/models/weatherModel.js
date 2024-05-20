var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var weatherSchema = new Schema({
	'temperature' : Int,
    'temperatureDay' : Int,
    'temperatureNight' : Int,
	'precipitation' : Int,
    'humidity' : Int,
    'wind' : Int,
    'desc' : String,
});

var Weather = mongoose.model('weather', userSchema);
module.exports = Weather;
