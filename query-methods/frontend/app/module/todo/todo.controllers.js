'use strict';

angular.module('app.todo.controllers', [])
    .config(['$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('todo', {
                    url: '/',
                    abstract: true,
                    template: '<ui-view/>'
                })
                .state('todo.add', {
                    url: 'todo/add',
                    controller: 'AddTodoController',
                    templateUrl: 'todo/add-todo-view.html'
                })
                .state('todo.list', {
                    url: '',
                    controller: 'TodoListController',
                    templateUrl: 'todo/todo-list-view.html',
                    resolve: {
                        todoEntries: ['TodoService', function(TodoService) {
                            return TodoService.findAll();
                        }]
                    }
                })
                .state('todo.view', {
                    url: 'todo/:id',
                    controller: 'ViewTodoController',
                    templateUrl: 'todo/view-todo-view.html',
                    resolve: {
                        todoEntry: ['$stateParams', 'TodoService', function($stateParams, TodoService) {
                            return TodoService.findById($stateParams.id);
                        }]
                    }
                });
        }
    ])
    .controller('AddTodoController', ['$scope', '$state', 'NotificationService', 'TodoService',
        function($scope, $state, NotificationService, TodoService) {
            console.log('Rendering add todo entry page.');
            $scope.todoEntry = {};

            $scope.saveTodoEntry = function() {
                console.log('Adding a new todo entry: ', $scope.todoEntry);

                var onSuccess = function(added) {
                    NotificationService.flashMessage('todo.notifications.add.success', 'success');
                    $state.go('todo.view', {id: added.id});
                };

                var onError = function() {
                    NotificationService.flashMessage('todo.notifications.add.error', 'errors');
                };

                TodoService.add($scope.todoEntry, onSuccess, onError);
            };
    }])
    .controller('TodoListController', ['$scope', 'todoEntries', function ($scope, todoEntries) {
        console.log('Rendering todo entry list page for todo entries: ', todoEntries);
        $scope.todoEntries = todoEntries;
    }])
    .controller('ViewTodoController', ['$scope', 'todoEntry', function($scope, todoEntry) {
        console.log('Rending view todo entry page for todo entry: ', todoEntry);
        $scope.todoEntry = todoEntry;
    }]);