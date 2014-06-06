'use strict';

// Configuring the Exercises module
angular.module('exercises').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Exercises', 'exercises', 'dropdown', '/exercises(/create)?');
		Menus.addSubMenuItem('topbar', 'exercises', 'List Exercises', 'exercises');
		Menus.addSubMenuItem('topbar', 'exercises', 'New Exercises', 'exercises/create');
	}
]);