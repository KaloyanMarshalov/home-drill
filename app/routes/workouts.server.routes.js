'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	workouts = require('../../app/controllers/workouts');

module.exports = function (app) {
    // Workouts Routes
    app.route('/workouts')
		.get(workouts.list)
		.post(users.requiresLogin, workouts.create);

    app.route('/workouts/:workoutId')
		.get(workouts.read)
		.put(users.requiresLogin, workouts.hasAuthorization, workouts.update)
		.delete(users.requiresLogin, workouts.hasAuthorization, workouts.delete);

    // Finish by binding the workouts middleware
    app.param('workoutId', workouts.workoutByID);
};