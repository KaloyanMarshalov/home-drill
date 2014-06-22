'use strict';

angular.module('workouts').controller('WorkoutsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workouts', 'Exercises',
	function ($scope, $stateParams, $location, Authentication, Workouts, Exercises) {
	    $scope.authentication = Authentication;
        
	    var storageExercises = [];
	    var storageIndex = 0;
	    var workoutExercises = [];
        
	    for (var prop in sessionStorage) {
	        var storageExercise = Exercises.get({
	            exerciseId: sessionStorage.getItem(prop)
	        });
	        storageExercises.push(storageExercise);
	    }
	    console.log(storageExercises);
	    $scope.currExercise = storageExercises[storageIndex];

	    $scope.showTimer = function () {
	        $scope.durationSelected = true;
	    };

	    $scope.create = function () {
	        console.log(workoutExercises);

	        if (storageIndex === sessionStorage.length) {
	            var workout = new Workouts({
	                name: this.workoutName,
	                exercises: workoutExercises
	            });
	            console.log(workout);

	            workout.$save(function (response) {
	                $location.path('workout/' + response._id);
	            }, function (errorResponse) {
	                $scope.error = errorResponse.data.message;
	            });
	            sessionStorage.clear();
	        } else {
	            workoutExercises.push({
	                name: $scope.currExercise.name,
	                exerciseId: $scope.currExercise._id,
	                type: this.type,
	                time: this.time
	            });

	            storageIndex += 1;
	            $scope.currExercise = storageExercises[storageIndex];
	            console.log(storageIndex);
	        }
	    };

	    $scope.remove = function (workout) {
	        if (workout) {
	            workout.$remove();

	            for (var i in $scope.workouts) {
	                if ($scope.workouts[i] === workout) {
	                    $scope.workouts.splice(i, 1);
	                }
	            }
	        } else {
	            $scope.workout.$remove(function () {
	                $location.path('workouts');
	            });
	        }
	    };

	    $scope.update = function () {
	        var workout = $scope.workout;

	        workout.$update(function () {
	            $location.path('workouts/' + workout._id);
	        }, function (errorResponse) {
	            $scope.error = errorResponse.data.message;
	        });
	    };

	    $scope.find = function () {
	        $scope.workouts = Workouts.query();
	    };

	    $scope.findOne = function () {
	        $scope.workout = Workouts.get({
	            workoutId: $stateParams.workoutId
	        });
	    };
	}
]);
