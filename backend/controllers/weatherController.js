var WeatherModel = require('../models/userModel.js');
var LocationModel = require('../models/locationModel.js');
var WeatherModel = require('../models/weatherModel.js');

module.exports = {

    list: function (req, res) {
        WeatherModel.find(function (err, weather) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting weather.',
                    error: err
                });
            }

            return res.json(weather);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        WeatherModel.findOne({_id: id}, function (err, weather) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting weather.',
                    error: err
                });
            }

            if (!weather) {
                return res.status(404).json({
                    message: 'No such weather'
                });
            }

            return res.json(weather);
        });
    },

    create: function (req, res) {
        var weather = new WeatherModel({
            temperature : req.body.temperature,
            temperatureDay : req.body.temperatureDay,
            temperatureNight : req.body.temperatureNight,
	        precipitation : req.body.precipitation,
            humidity : req.body.humidity,
            wind : req.body.wind,
            desc : req.body.desc,
        });

        weather.save(function (err, weather) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating weather',
                    error: err
                });
            }

            return res.redirect('/');
        });
    },

    update: function (req, res) {
        var id = req.params.id;

        WeatherModel.findOne({_id: id}, function (err, weather) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting weather',
                    error: err
                });
            }

            if (!weather) {
                return res.status(404).json({
                    message: 'No such weather'
                });
            }

            weather.temperature = req.body.temperature ? req.body.temperature : weather.temperature;
			weather.temperatureDay = req.body.temperatureDay ? req.body.temperatureDay : weather.temperatureDay;
			weather.temperatureNight = req.body.temperatureNight ? req.body.temperatureNight : weather.temperatureNight;
            weather.precipitation = req.body.precipitation ? req.body.precipitation : weather.precipitation;
			weather.humidity = req.body.humidity ? req.body.humidity : weather.humidity;
			weather.wind = req.body.wind ? req.body.wind : weather.wind;
            weather.desc = req.body.desc ? req.body.desc : weather.desc;
			
            weather.save(function (err, weather) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating weather.',
                        error: err
                    });
                }

                return res.json(weather);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;

        WeatherModel.findByIdAndRemove(id, function (err, weather) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the weather.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },
};
