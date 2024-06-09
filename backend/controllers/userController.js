var UserModel = require('../models/userModel.js');
var LocationModel = require('../models/locationModel.js');

module.exports = {

    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            return res.json(user);
        });
    },

    create: function (req, res) {
        var user = new UserModel({
			username : req.body.username,
			password : req.body.password,
			email : req.body.email,
            favs : [],
        });

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating user',
                    error: err
                });
            }
            return res.json(user);
        });
    },

    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.password = req.body.password ? req.body.password : user.password;
			user.email = req.body.email ? req.body.email : user.email;
            user.favs = req.body.favs ? req.body.favs : user.favs;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    login: function(req, res, next){
        UserModel.authenticate(req.body.username, req.body.password, function(err, user){
            if(err || !user){
                var err = new Error('Wrong username or password');
                err.status = 401;
                return next(err);
            }
            req.session.userId = user._id;
            return res.json(user);
        });
    },

    profile: function(req, res, next){
        var userId = req.body.userID;
        UserModel.findById(userId)
        .exec(function(error, user){
            if(error){
                return next(error);
            } else{
                if(user===null){
                    var err = new Error('Not authorized, go back!');
                    err.status = 400;
                    return next(err);
                } else{
                    return res.json(user);
                }
            }
        });
    },

    logout: function(req, res, next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                } else{
                    return res.json({ message: 'Logout successful' });
                }
            });
        }
    },

    addFavourite: function (req, res) {
        var userId = req.body.userID;
        var city = req.body.city;

        LocationModel.findOne({ city: city }, function (err, existingLocation) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when searching for location',
                    error: err
                });
            }
    
            if (existingLocation) {
                UserModel.findById(userId, function(err, user) {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                            message: 'Error when getting user.',
                            error: err
                        });
                    }
                
                    if (!user) {
                        return res.status(404).json({
                            message: 'No such user'
                        });
                    }
                
                    var locationId = existingLocation._id;
                    user.favs.push(locationId);
                
                    user.save(function(err, updatedUser) {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                message: 'Error when updating user.',
                                error: err
                            });
                        }
                
                        return res.json(updatedUser);
                    });
                });
            } else {
                var location = new LocationModel({
                    lat: req.body.lat,
                    long: req.body.long,
                    city: city
                });
    
                location.save(function (err, newLocation) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating location',
                            error: err
                        });
                    }
    
                    UserModel.findById(userId, function(err, user) {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                message: 'Error when getting user.',
                                error: err
                            });
                        }
                    
                        if (!user) {
                            return res.status(404).json({
                                message: 'No such user'
                            });
                        }
                    
                        var locationId = newLocation._id;
                        user.favs.push(locationId);
                    
                        user.save(function(err, updatedUser) {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({
                                    message: 'Error when updating user.',
                                    error: err
                                });
                            }
                    
                            return res.json(updatedUser);
                        });
                    });
                });
            }
        });
    },

    getFavourite: function(req, res) {
        var userId = req.body.userID;
    
        UserModel.findById(userId, function(err, user) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
    
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            LocationModel.find({
                '_id': { $in: user.favs}
            }, function(err, locations) {
                if (err) {
                    console.error(err);
                    return res.status(500).json({
                        message: 'Error when getting locations.',
                        error: err
                    });
                }
                console.log(locations);
                return res.json(locations);
            });
        });
    }
};
