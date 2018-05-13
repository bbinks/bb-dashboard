'use strict';

angular.module('dashboard.todo', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/todo', {
    templateUrl: 'todo/todo.html',
    controller: 'TodoCtrl'
  });
}])

.controller('TodoCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray){

	var ref = new Firebase('https://jerry-todolist.firebaseio.com/tasks');
	$scope.tasks = $firebaseArray(ref);

/* -----------------------------------------------------------------------
								ADD TASK
----------------------------------------------------------------------- */	

	//Show Add Form
	$scope.showAddForm = function(){

		//Hide Stuff
		$scope.addFormShow = true;
		$scope.taskShow = false;
		$scope.editFormShow = false;
	}

	//Hide Add Form
	$scope.hideAddForm = function(){
		$scope.addFormShow = false;
	}

	//Submit New Task
	$scope.addFormSubmit = function(){

		// Assign Value
		if($scope.title){var title = $scope.title;}else{var title = "";}
		if($scope.desc){var desc = $scope.desc;}else{var desc = "";}

		//Construct new object
		$scope.tasks.$add({
			title: title,
			desc: desc,
			completed: false
		}).then(function(ref){
			var id = ref.key();
			console.log("added contact with id: " + id);

			clearFields();
			$scope.addFormShow = false;
			$scope.message = "Task Added!";
		})
	}

/* -----------------------------------------------------------------------
							EDIT TASK
----------------------------------------------------------------------- */	

	//Show edit form
	$scope.showEditForm = function(task){
		
		//Assign values
		$scope.id = task.$id;
		$scope.title = task.title;
		$scope.desc = task.desc;
		$scope.completed = task.completed;

		//Hide stuff
		$scope.addFormShow = false;
		$scope.taskShow = false;
		$scope.editFormShow = true;
	}

	//Hide edit form
	$scope.hideEditForm = function(){
		$scope.editFormShow = false;
	}

	//Submit edit form
	$scope.editFormSubmit = function(){

		// Assign Value
		if($scope.title){var title = $scope.title;}else{var title = "";}
		if($scope.desc){var desc = $scope.desc;}else{var desc = "";}

		//Fetch id of selected task
		var id = $scope.id;
		var selectedTask = $scope.tasks.$getRecord(id);
		console.log(id);

		//Change properties
		selectedTask.title = title;
		selectedTask.desc = desc;
		selectedTask.completed = $scope.completed;
		console.log("lol");

		//Update firebase
		$scope.tasks.$save(selectedTask)
		.then(function(){
			clearFields();
			$scope.editFormShow = false;
			$scope.message = "Task editted!";
		});
	}

/* -----------------------------------------------------------------------
		CLEAR FIELDS, SHOW TASK, UPDATE STATUS, DELETE TASK
----------------------------------------------------------------------- */	

	//Clear input field
	function clearFields(){
		$scope.title = "";
		$scope.desc = "";
		$scope.completed = false;
	}

	//Show selected task
	$scope.showTask = function(task){
		
		//Assign values
		$scope.taskTitle = task.title;
		$scope.taskDesc = task.desc;
		$scope.taskCompleted = task.completed;
		
		//Hide stuff
		$scope.addFormShow = false;
		$scope.taskShow = true;
		$scope.editFormShow = false;
	}

	//Update status of task
	$scope.updateStatus = function(task){

		//Fetch id of selected task
		var id = task.$id;
		var selectedTask = $scope.tasks.$getRecord(id);

		//Change [completed] property
		selectedTask.completed = task.completed;

		//Update firebase
		$scope.tasks.$save(selectedTask).then(function(ref){
			$scope.taskCompleted = task.completed;
		});
	}

	//Remove selected task
	$scope.removeTask = function(task){
		
		$scope.tasks.$remove(task);
		$scope.message = "Task removed!";

		//Hide stuff
		$scope.addFormShow = false;
		$scope.taskShow = false;
		$scope.editFormShow = false;
	}

}]);