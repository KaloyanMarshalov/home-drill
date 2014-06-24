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
	    $scope.currStorageEx = storageExercises[storageIndex];

	    $scope.showTimer = function () {
	        $scope.durationSelected = true;
	    };

	    $scope.create = function () {
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
                // Clear the sessionStorage after saving the workout
	            sessionStorage.clear();
	            storageIndex = 0;
	        } else {
	            workoutExercises.push({
	                name: $scope.currStorageEx.name,
	                picture: $scope.currStorageEx.picture,
	                type: this.type,
	                time: this.time
	            });

	            storageIndex += 1;
	            $scope.currStorageEx = storageExercises[storageIndex];
	            console.log(storageIndex);
	        }
	        console.log(workoutExercises);
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
	        console.log($scope.workouts);
	    };

	    $scope.findOne = function () {
	        $scope.workout = Workouts.get({
	            workoutId: $stateParams.workoutId
	        });
	    };

	    $scope.execute = function () {
	        var time = $scope.time,
                workoutPart = $scope.workoutPart;
	    };
	}
]);
