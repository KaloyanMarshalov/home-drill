'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Exercise = mongoose.model('Exercise'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Exercise already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create an exercise
 */
exports.create = function(req, res) {
	var exercise = new Exercise(req.body);
	exercise.user = req.user;

	exercise.save(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
		    res.jsonp(exercise);
		}
	});
};

/**
 * Show the current exercise
 */
exports.read = function(req, res) {
	res.jsonp(req.exercise);
};

/**
 * Update an exercise
 */
exports.update = function(req, res) {
    var exercise = req.exercise;

    exercise = _.extend(exercise, req.body);

    exercise.save(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
		    res.jsonp(exercise);
		}
	});
};

/**
 * Delete an exercise
 */
exports.delete = function(req, res) {
    var exercise = req.exercise;

    exercise.remove(function (err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
		    res.jsonp(exercise);
		}
	});
};

/**
 * List of Exercises
 */

exports.list = function(req, res) {
    Exercise.find().sort('-created').populate('user', 'displayName').exec(function (err, exercises) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
		    res.jsonp(exercises);
		}
	});
};

/**
 * Exercise middleware
 */
exports.exerciseByID = function (req, res, next, id) {
    Exercise.findById(id).populate('user', 'displayName').exec(function (err, exercise) {
		if (err) return next(err);
		if (!exercise) return next(new Error('Failed to load exercise ' + id));
		req.exercise = exercise;
		next();
	});
};

/**
 * Exercise authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    /*if (req.exercise.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}*/
	next();
};