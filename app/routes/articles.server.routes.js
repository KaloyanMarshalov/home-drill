'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	exercises = require('../../app/controllers/exercises');

module.exports = function(app) {
	// Exercise Routes
    app.route('/exercises')
		.get(exercises.list)
		.post(users.requiresLogin, exercises.create);

	app.route('/exercises/:exerciseId')
		.get(exercises.read)
		.put(users.requiresLogin, exercises.hasAuthorization, exercises.update)
		.delete(users.requiresLogin, exercises.hasAuthorization, exercises.delete);

	// Finish by binding the exercise middleware
	app.param('exerciseId', exercises.exerciseByID);
};