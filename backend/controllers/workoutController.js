var WorkoutModel = require('../models/workoutModel.js');

module.exports = {

    list: function (req, res) {
        WorkoutModel.find(function (err, workout) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting workout.',
                    error: err
                });
            }

            return res.json(workout);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        WorkoutModel.findOne({_id: id}, function (err, workout) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting workout.',
                    error: err
                });
            }

            if (!workout) {
                return res.status(404).json({
                    message: 'No such workout'
                });
            }

            return res.json(workout);
        });
    },

    create: function (req, res) {
        var workout = new WorkoutModel({
            weatherDesc : req.body.weatherDesc,
            workoutDesc : req.body.workoutDesc
        });

        workout.save(function (err, workout) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating workout',
                    error: err
                });
            }

            return res.redirect('/');
        });
    },

    update: function (req, res) {
        var id = req.params.id;

        WorkoutModel.findOne({_id: id}, function (err, workout) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting workout',
                    error: err
                });
            }

            if (!workout) {
                return res.status(404).json({
                    message: 'No such workout'
                });
            }

            workout.weatherDesc = req.body.weatherDesc ? req.body.weatherDesc : workout.weatherDesc;
			workout.workoutDesc = req.body.workoutDesc ? req.body.workoutDesc : workout.workoutDesc;
			
            workout.save(function (err, workout) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating workout.',
                        error: err
                    });
                }

                return res.json(workout);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;

        WorkoutModel.findByIdAndRemove(id, function (err, workout) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the workout.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    findByWeather: function (req, res) {
        var weatherDesc1 = req.body.weatherDesc;
    
        WorkoutModel.findOne({weatherDesc: weatherDesc1}, function (err, workout) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting workout.',
                    error: err
                });
            }
    
            return res.json(workout);
        });
    },
};
