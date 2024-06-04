var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var weatherSchema = new Schema({
	'temperature' : Number,
    'temperatureDay' : Number,
    'temperatureNight' : Number,
	'precipitation' : Number,
    'humidity' : Number,
    'wind' : Number,
    'desc' : String,
});

var Weather = mongoose.model('weather', weatherSchema);
module.exports = Weather;
