﻿'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'mean';
    var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ui.utils'];

    // Add a new vertical module
    var registerModule = function (moduleName) {
        // Create angular module
        angular.module(moduleName, []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    };
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function ($locationProvider) {
	    $locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('exercises');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('workouts');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
	    // Redirect to home view when route not found
	    $urlRouterProvider.otherwise('/');

	    // Home state routing
	    $stateProvider.
		state('home', {
		    url: '/',
		    templateUrl: 'modules/core/views/home.client.view.html'
		}).
        state('about', {
            url: '/about',
            templateUrl: 'modules/core/views/about.client.view.html'
        });
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function ($scope, Authentication, Menus) {
	    $scope.authentication = Authentication;
	    $scope.isCollapsed = false;
	    $scope.menu = Menus.getMenu('topbar');

	    $scope.toggleCollapsibleMenu = function () {
	        $scope.isCollapsed = !$scope.isCollapsed;
	    };

	    // Collapsing the menu after navigation
	    $scope.$on('$stateChangeSuccess', function () {
	        $scope.isCollapsed = false;
	    });
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function ($scope, Authentication) {
	    // This provides Authentication context.
	    $scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
	function () {
	    // Define a set of default roles
	    this.defaultRoles = ['user'];

	    // Define the menus object
	    this.menus = {};

	    // A private function for rendering decision 
	    var shouldRender = function (user) {
	        if (user) {
	            for (var userRoleIndex in user.roles) {
	                for (var roleIndex in this.roles) {
	                    if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
	                        return true;
	                    }
	                }
	            }
	        } else {
	            return this.isPublic;
	        }

	        return false;
	    };

	    // Validate menu existance
	    this.validateMenuExistance = function (menuId) {
	        if (menuId && menuId.length) {
	            if (this.menus[menuId]) {
	                return true;
	            } else {
	                throw new Error('Menu does not exists');
	            }
	        } else {
	            throw new Error('MenuId was not provided');
	        }

	        return false;
	    };

	    // Get the menu object by menu id
	    this.getMenu = function (menuId) {
	        // Validate that the menu exists
	        this.validateMenuExistance(menuId);

	        // Return the menu object
	        return this.menus[menuId];
	    };

	    // Add new menu object by menu id
	    this.addMenu = function (menuId, isPublic, roles) {
	        // Create the new menu
	        this.menus[menuId] = {
	            isPublic: isPublic || false,
	            roles: roles || this.defaultRoles,
	            items: [],
	            shouldRender: shouldRender
	        };

	        // Return the menu object
	        return this.menus[menuId];
	    };

	    // Remove existing menu object by menu id
	    this.removeMenu = function (menuId) {
	        // Validate that the menu exists
	        this.validateMenuExistance(menuId);

	        // Return the menu object
	        delete this.menus[menuId];
	    };

	    // Add menu item object
	    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
	        // Validate that the menu exists
	        this.validateMenuExistance(menuId);

	        // Push new menu item
	        this.menus[menuId].items.push({
	            title: menuItemTitle,
	            link: menuItemURL,
	            menuItemType: menuItemType || 'item',
	            menuItemClass: menuItemType,
	            uiRoute: menuItemUIRoute || ('/' + menuItemURL),
	            isPublic: isPublic || this.menus[menuId].isPublic,
	            roles: roles || this.defaultRoles,
	            items: [],
	            shouldRender: shouldRender
	        });

	        // Return the menu object
	        return this.menus[menuId];
	    };

	    // Add submenu item object
	    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
	        // Validate that the menu exists
	        this.validateMenuExistance(menuId);

	        // Search for menu item
	        for (var itemIndex in this.menus[menuId].items) {
	            if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
	                // Push new submenu item
	                this.menus[menuId].items[itemIndex].items.push({
	                    title: menuItemTitle,
	                    link: menuItemURL,
	                    uiRoute: menuItemUIRoute || ('/' + menuItemURL),
	                    isPublic: isPublic || this.menus[menuId].isPublic,
	                    roles: roles || this.defaultRoles,
	                    shouldRender: shouldRender
	                });
	            }
	        }

	        // Return the menu object
	        return this.menus[menuId];
	    };

	    // Remove existing menu object by menu id
	    this.removeMenuItem = function (menuId, menuItemURL) {
	        // Validate that the menu exists
	        this.validateMenuExistance(menuId);

	        // Search for menu item to remove
	        for (var itemIndex in this.menus[menuId].items) {
	            if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
	                this.menus[menuId].items.splice(itemIndex, 1);
	            }
	        }

	        // Return the menu object
	        return this.menus[menuId];
	    };

	    // Remove existing menu object by menu id
	    this.removeSubMenuItem = function (menuId, submenuItemURL) {
	        // Validate that the menu exists
	        this.validateMenuExistance(menuId);

	        // Search for menu item to remove
	        for (var itemIndex in this.menus[menuId].items) {
	            for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
	                if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
	                    this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
	                }
	            }
	        }

	        // Return the menu object
	        return this.menus[menuId];
	    };

	    //Adding the topbar menu
	    this.addMenu('topbar');
	}
]);
'use strict';

// Setting up route
angular.module('exercises').config(['$stateProvider',
	function ($stateProvider) {
	    // Exercises state routing
	    $stateProvider.
		state('listExercises', {
		    url: '/exercises',
		    templateUrl: 'modules/exercises/views/list-exercises.client.view.html'
		}).
		state('createExercise', {
		    url: '/exercises/create',
		    templateUrl: 'modules/exercises/views/create-exercise.client.view.html'
		}).
		state('viewExercise', {
		    url: '/exercises/:exerciseId',
		    templateUrl: 'modules/exercises/views/view-exercise.client.view.html'
		}).
		state('editExercise', {
		    url: '/exercises/:exerciseId/edit',
		    templateUrl: 'modules/exercises/views/edit-exercise.client.view.html'
		});
	}
]);
'use strict';

angular.module('exercises').controller('ExercisesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Exercises',
	function ($scope, $stateParams, $location, Authentication, Exercises) {
	    $scope.authentication = Authentication;

	    $scope.create = function () {
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
	            exercise.equipment = 'None';
	        }

	        exercise.$save(function (response) {
	            $location.path('exercise/' + response._id);
	        }, function (errorResponse) {
	            $scope.error = errorResponse.data.message;
	        });
	    };

	    $scope.remove = function (exercise) {
	        if (exercise) {
	            exercise.$remove();

	            for (var i in $scope.exercises) {
	                if ($scope.exercises[i] === exercise) {
	                    $scope.exercises.splice(i, 1);
	                }
	            }
	        } else {
	            $scope.exercise.$remove(function () {
	                $location.path('exercises');
	            });
	        }
	    };

	    $scope.update = function () {
	        var exercise = $scope.exercise;

	        if (!this.equipment) {
	            exercise.equipment = 'None';
	        }

	        exercise.$update(function () {
	            $location.path('exercises/' + exercise._id);
	        }, function (errorResponse) {
	            $scope.error = errorResponse.data.message;
	        });
	    };

	    $scope.find = function () {
	        $scope.exercises = Exercises.query();
	    };

	    $scope.findOne = function () {
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

	    $scope.addToWorkout = function () {
	        var storageLength = sessionStorage.length;

	        sessionStorage.setItem('exercise' + storageLength, $scope.exercise._id);
	        $scope.successfulAdding = !$scope.successfulAdding;
	    };
	}
]).filter('displayMuscles', function () {
    return function (input) {
        var output = '';
        output = input.join(', ');
        return output;
    };
});
'use strict';

//Exercises service used for communicating with the exercises REST endpoints
angular.module('exercises').factory('Exercises', ['$resource',
	function ($resource) {
	    return $resource('exercises/:exerciseId', {
	        exerciseId: '@_id'
	    }, {
	        update: {
	            method: 'PUT'
	        }
	    });
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function ($httpProvider) {
	    // Set the httpProvider "not authorized" interceptor
	    $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function ($q, $location, Authentication) {
			    return {
			        responseError: function (rejection) {
			            switch (rejection.status) {
			                case 401:
			                    // Deauthenticate the global user
			                    Authentication.user = null;

			                    // Redirect to signin page
			                    $location.path('signin');
			                    break;
			                case 403:
			                    // Add unauthorized behaviour 
			                    break;
			            }

			            return $q.reject(rejection);
			        }
			    };
			}
	    ]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function ($stateProvider) {
	    // Users state routing
	    $stateProvider.
		state('profile', {
		    url: '/settings/profile',
		    templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
		    url: '/settings/password',
		    templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
		    url: '/settings/accounts',
		    templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
		    url: '/signup',
		    templateUrl: 'modules/users/views/signup.client.view.html'
		}).
		state('signin', {
		    url: '/signin',
		    templateUrl: 'modules/users/views/signin.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function ($scope, $http, $location, Authentication) {
	    $scope.authentication = Authentication;

	    //If user is signed in then redirect back home
	    if ($scope.authentication.user) $location.path('/');

	    $scope.signup = function () {
	        $http.post('/auth/signup', $scope.credentials).success(function (response) {
	            //If successful we assign the response to the global user model
	            $scope.authentication.user = response;

	            //And redirect to the index page
	            $location.path('/');
	        }).error(function (response) {
	            $scope.error = response.message;
	        });
	    };

	    $scope.signin = function () {
	        $http.post('/auth/signin', $scope.credentials).success(function (response) {
	            //If successful we assign the response to the global user model
	            $scope.authentication.user = response;

	            //And redirect to the index page
	            $location.path('/');
	        }).error(function (response) {
	            $scope.error = response.message;
	        });
	    };
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function ($scope, $http, $location, Users, Authentication) {
	    $scope.user = Authentication.user;

	    // If user is not signed in then redirect back home
	    if (!$scope.user) $location.path('/');

	    // Check if there are additional accounts 
	    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
	        for (var i in $scope.user.additionalProvidersData) {
	            return true;
	        }

	        return false;
	    };

	    // Check if provider is already in use with current user
	    $scope.isConnectedSocialAccount = function (provider) {
	        return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
	    };

	    // Remove a user social account
	    $scope.removeUserSocialAccount = function (provider) {
	        $scope.success = $scope.error = null;

	        $http.delete('/users/accounts', {
	            params: {
	                provider: provider
	            }
	        }).success(function (response) {
	            // If successful show success message and clear form
	            $scope.success = true;
	            $scope.user = Authentication.user = response;
	        }).error(function (response) {
	            $scope.error = response.message;
	        });
	    };

	    // Update a user profile
	    $scope.updateUserProfile = function () {
	        $scope.success = $scope.error = null;
	        var user = new Users($scope.user);

	        user.$update(function (response) {
	            $scope.success = true;
	            Authentication.user = response;
	        }, function (response) {
	            $scope.error = response.data.message;
	        });
	    };

	    // Change user password
	    $scope.changeUserPassword = function () {
	        $scope.success = $scope.error = null;

	        $http.post('/users/password', $scope.passwordDetails).success(function (response) {
	            // If successful show success message and clear form
	            $scope.success = true;
	            $scope.passwordDetails = null;
	        }).error(function (response) {
	            $scope.error = response.message;
	        });
	    };
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function () {
	    var _this = this;

	    _this._data = {
	        user: window.user
	    };

	    return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function ($resource) {
	    return $resource('users', {}, {
	        update: {
	            method: 'PUT'
	        }
	    });
	}
]);
'use strict';

// Setting up route
angular.module('workouts').config(['$stateProvider',
	function ($stateProvider) {
	    // Workouts state routing
	    $stateProvider.
		state('listWorkouts', {
		    url: '/workouts',
		    templateUrl: 'modules/workouts/views/list-workouts.client.view.html'
		}).
		state('createWorkout', {
		    url: '/workouts/create',
		    templateUrl: 'modules/workouts/views/create-workout.client.view.html'
		}).
		state('viewWorkout', {
		    url: '/workouts/:workoutId',
		    templateUrl: 'modules/workouts/views/view-workout.client.view.html'
		}).
		state('editWorkout', {
		    url: '/workouts/:workoutId/edit',
		    templateUrl: 'modules/workouts/views/edit-workout.client.view.html'
		}).
        state('executeWorkout', {
            url: '/workouts/:workoutId/execute',
            templateUrl: 'modules/workouts/views/execute-workout.client.view.html'
        });
	}
]);
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
'use strict';

//Workouts service used for communicating with the workouts REST endpoints
angular.module('workouts').factory('Workouts', ['$resource',
	function ($resource) {
	    return $resource('workouts/:workoutId', {
	        workoutId: '@_id'
	    }, {
	        update: {
	            method: 'PUT'
	        }
	    });
	}
]);