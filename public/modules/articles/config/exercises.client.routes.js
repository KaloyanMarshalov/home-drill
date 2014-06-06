'use strict';

// Setting up route
angular.module('exercises').config(['$stateProvider',
	function($stateProvider) {
		// Exercises state routing
		$stateProvider.
		state('listExercises', {
			url: '/exercises',
			templateUrl: 'modules/articles/views/list-exercises.client.view.html'
		}).
		state('createExercise', {
			url: '/exercises/create',
			templateUrl: 'modules/articles/views/create-exercise.client.view.html'
		}).
		state('viewExercise', {
			url: '/exercises/:exerciseId',
			templateUrl: 'modules/articles/views/view-exercise.client.view.html'
		}).
		state('editExercise', {
			url: '/exercises/:exerciseId/edit',
			templateUrl: 'modules/articles/views/edit-exercise.client.view.html'
		});
	}
]);