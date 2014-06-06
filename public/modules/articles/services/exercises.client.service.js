'use strict';

//Exercises service used for communicating with the articles REST endpoints
angular.module('exercises').factory('Exercises', ['$resource',
	function($resource) {
		return $resource('exercises/:exerciseId', {
			exerciseId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);