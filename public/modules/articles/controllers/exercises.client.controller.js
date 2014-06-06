'use strict';

angular.module('exercises').controller('ExercisesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Exercises',
	function($scope, $stateParams, $location, Authentication, Exercises) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var exercise = new Exercises({
			    name: this.name,
			    type: this.type,
				difficulty: this.difficulty,
				muscleGroup: this.muscleGroup,
                equipment: this.equipment,
				picture: this.picture,
                youTube: this.youTube
			});
			exercise.$save(function(response) {
				$location.path('exercise/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.title = '';
			this.content = '';
		};
        //TODO: remove, update, find, findOne for exercises!!!
		$scope.remove = function(exercise) {
			if (exercise) {
				exercise.$remove();

				for (var i in $scope.exercises) {
					if ($scope.exercises[i] === exercise) {
						$scope.exercises.splice(i, 1);
					}
				}
			} else {
				$scope.exercise.$remove(function() {
					$location.path('exercises');
				});
			}
		};

		$scope.update = function() {
		    var exercise = $scope.exercise;

			exercise.$update(function() {
				$location.path('exercises/' + exercise._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.exercises = Exercises.query();
		};

		$scope.findOne = function() {
			$scope.exercise = Exercises.get({
				exerciseId: $stateParams.exerciseId
			});
		};
	}
]);