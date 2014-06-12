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

			if (!this.equipment) {
			    exercise.equipment = 'None'
			};

			exercise.$save(function (response) {
			    
				$location.path('exercise/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			this.title = '';
			this.content = '';
		};

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

		    if (!this.equipment) {
		        exercise.equipment = 'None'
		    };

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

		$scope.range = function () {
		    var range = [];
		    for (var i = 0; i < $scope.exercises.length; i++) {
		        if (i % 4 === 0) {
		            range.push(i);
		        }
		    }
		    return range;
		};
	}
]).filter('displayMuscles', function () {
    return function (input) {
        var output = "";
        output = input.join(', ');
        return output;
    };
});
