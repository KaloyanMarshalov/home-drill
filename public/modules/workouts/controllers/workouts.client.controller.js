'use strict';

angular.module('workouts').controller('WorkoutsController', ['$scope', '$stateParams', '$location', '$timeout', 'Authentication', 'Workouts', 'Exercises',
	function ($scope, $stateParams, $location, $timeout, Authentication, Workouts, Exercises) {
	    $scope.authentication = Authentication;
        
	    var storageExercises = [];
	    var storageIndex = 0;
	    var workoutExercises = [];
        //fill an array with exercises from sessionStorage
	    for (var prop in sessionStorage) {
	        var storageExercise = Exercises.get({
	            exerciseId: sessionStorage.getItem(prop)
	        });
	        storageExercises.push(storageExercise);
	    }
	    $scope.currStorageEx = storageExercises[storageIndex];

	    $scope.showTimerSelect = function () {
	        $scope.durationSelected = true;
	    };
        
	    $scope.exerciseTime = 0;
	    $scope.incrementTime = function () {
	        if ($scope.exerciseTime === 120) {
	            return;
	        } else {
	            $scope.exerciseTime += 10;
	        }
	    };
	    $scope.decrementTime = function () {
	        if ($scope.exerciseTime === 0) {
	            return;
	        } else {
	            $scope.exerciseTime -= 10;
	        }
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
	        } else {    //take data from client view and push an Exercise Obj into an array
	            workoutExercises.push({
	                name: $scope.currStorageEx.name,
	                picture: $scope.currStorageEx.picture,
	                type: this.type,
	                time: this.exerciseTime
	            });

	            storageIndex += 1;
	            $scope.currStorageEx = storageExercises[storageIndex];
	            $scope.exerciseTime = 0;
	            $scope.durationSelected = false;
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
        
        //Function for displaying ammount of seconds in a timer like fashion
	    $scope.timerFunction = function (time) {
	        if (time <= 9) {
	            $scope.time = '0:0' + time;
	        } else if (time <= 59) {
	            $scope.time = '0:' + time;
	        } else {
	            var minutes = time / 60 | 0,
                    seconds = time % 60;
	            if (seconds <= 9) {
	                $scope.time = minutes + ':0' + seconds;
	            } else {
	                $scope.time = minutes + ':' + seconds;
	            }
	        }
	    };

	    var prepTime = 11,
            exerciseTime = 0,
            playedExerciseIndex = 0,
            excludedSeconds = 0,
            workoutTimeout;
        
        //Execution of workout logic
	    $scope.execute = function () {
	        $scope.currExercise = $scope.workout.exercises[playedExerciseIndex];

	        if (prepTime === 0) {

	            exerciseTime = $scope.currExercise.time;
	            $scope.workoutPart = 'Exercise';

	            if ($scope.currExercise.type === 'Repetitions') {
	                $scope.continueWorkoutBtn = true;
	                $scope.continueWorkout = function () {
	                    playedExerciseIndex += 1;
	                    prepTime = 11;
	                };
	            } else {
	                exerciseTime -= excludedSeconds;
	                excludedSeconds += 1;
	                if (exerciseTime === 0) {
	                    playedExerciseIndex += 1;
	                    prepTime = 11;
	                    excludedSeconds = 0;
	                }
	                $scope.timerFunction(exerciseTime);
	            }
	        } else {
	            $scope.workoutPart = 'Preparation time';
	            prepTime--;
	            $scope.timerFunction(prepTime);

	        }
	        if (playedExerciseIndex < $scope.workout.exercises.length) {
	            workoutTimeout = $timeout($scope.execute, 1000);
	        } else {
	            $scope.endWorkout = true;
	        }
	    };
	}
]);
