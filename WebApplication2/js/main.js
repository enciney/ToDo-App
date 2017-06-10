﻿var app = angular.module("TodoApp", ['ui.bootstrap', 'ngAnimate', 'ngSanitize', 'ngCsv']);
app.controller("todoController", function ($uibModal, $scope, $http) {

    $scope.headData = {
        userID: "userID",
        id: "TODO ID",
        title: "TITLE",
        completed: "COMPLETED",
        priority: "PRIORITY"
    }

    $scope.column = 'title'; // column to sort
    $scope.filteredItems = [];  // filtered items 
    $scope.choosedRows = [];   //  Choosed row/s for multiple choose

    $scope.reverse = false;  // sort ordering (Ascending or Descending). Set true for desending

    getData(); // refreshing data
    $scope.todos = []; // all todo data
    $scope.prioritySet = 'None';

    //#region POPUP-MODAL
    var $popup = this;

    $popup.open = function (todoData) {
        var index = $scope.todos.indexOf(todoData);
        $popup.viewedData = $scope.todos[index]; // store viewing data
        $popup.header = $scope.headData;

        $uibModal.open({
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'view.html', // pop up window
            controller: 'PopUpCtrl', // control for the pop up buttons
            controllerAs: '$popup',
            size: 'lg',
            resolve: {
                viewedData: function () {
                    return $popup.viewedData;

                },

                header: function () {
                    return $popup.header;

                }
            }
        });
    }
    //#endregion POPUP-MODAL


    //#region CSV
    $scope.headerTitle = function () {
        return (['Applicaion Name', 'UserID', 'TODO ID', 'TITLE', 'COMPLETED', 'PRIORITY']);
    }
    $scope.exportChoosed = function () {

        var choosedData = getChoosedTodos();
        var filt = $scope.filteredItems;
        if (filt.lenght <= 0)
            alert("FALSE SIZE");
        else
            alert($scope.filteredItems.length);
        return choosedData;
    }

    $scope.exportGrid = function () {
        var filt = $scope.filteredItems;
        if (filt.length <= 0) {
            alert("Grid is empty. Exporting empty file ...");
            return;
        }
        else
            return filt;

    }

    //#endregion CSV



    //#region SORT
    $scope.sortColumn = function (col) {

        $scope.column = col;
        if ($scope.reverse) {
            $scope.reverse = false;
            //$scope.reverseclass = 'arrow-up';
        } else {
            $scope.reverse = true;
            // $scope.reverseclass = 'arrow-down';
        }

    }

    $scope.sortClass = function (col) {

        if ($scope.column == col)
            if ($scope.reverse == true)
                return 'arrow-down';
            else
                return 'arrow-up';
        else
            return '';
    }

    //#endregion SORT

    //#region DELETE
    $scope.removeData = function (id) {
        var index = -1;
        var allTodos = eval($scope.todos);
        for (var i = 0; i < allTodos.length; i++) {
            if (allTodos[i].ID == id) {
                index = i;
                break;
            }
        }

        if (index == -1) {
            alert("Id is not exist");
        }
        else {
            $scope.allTodos = allTodos.splice(index, 1);
            deleteTodo(id);
        }
    }

    $scope.removeAll = function () {

        var deleted = [];
        for (i = 0 ; i < $scope.choosedRows.length ; i++) {
            alert($scope.choosedRows[i]);
            deleted.push($scope.choosedRows[i]);

        }
        $scope.choosedRows = [];

        $http({
            method: 'POST',
            url: "Default.aspx/DeleteTodoList",
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'dataType': 'json'
            },
            data: { id: deleted }  /*JSON.stringify({ id: id })*/
        }).then(function (response, status) {
            alert("Successfully Deleted");
            getData();
        });
    }

    function deleteTodo(id) {
        var post = $http({
            method: 'POST',
            url: "Default.aspx/DeleteTodo",
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'dataType': 'json'
            },
            data: { id: id }  /*JSON.stringify({ id: id })*/
        }).then(function (response, status) {
            alert("Successfully Deleted");

        });
    }
    //#endregion DELETE


    //#region CHOOSE
    $scope.choose = function (id) {

        var index = $scope.choosedRows.indexOf(id);

        if (index > -1) {
            $scope.choosedRows.splice(index, 1); // first param : index , second param : how many element should be deleted

        }
        else {
            $scope.choosedRows.push(id);
        }

    }

    $scope.chooseClass = function (id) {

        var index = findTodo(id);

        var temp_todo = $scope.todos[index];
        var priority = $scope.todos[index].priority;

        if ($scope.choosedRows.indexOf(id) > -1) {

            return 'choosed';
        }
        else {

            if (priority == 'LOW')
                return 'low';
            else if (priority == 'MEDIUM')
                return 'medium';
            else if (priority == 'HIGH')
                return 'high';

        }



    }
    //#endregion CHOOSE


    //#region find specific todo and choosed list
    function findTodo(id) {

        var allTodos = eval($scope.todos);
        var index = -1;
        for (i = 0 ; i < allTodos.length ; i++) {
            if (allTodos[i].ID == id) {
                index = i;
                return index;
            }
        }
        return -1;

    }

    function getChoosedTodos() {
        var allTodos = eval($scope.todos);
        var todoIDs = $scope.choosedRows;
        var choosedTodos = [];
        for (i = 0 ; i < todoIDs.length ; i++) {
            for (j = 0 ; j < allTodos.length ; j++) {
                if (allTodos[j].ID == todoIDs[i]) {
                    choosedTodos.push(allTodos[j]);
                    break;
                }
            }
        }

        return choosedTodos;
    }
    //#endregion find specific todo and choosed list



    $scope.updateTodo = function () {
        updatePriority();
    }



    //#region AJAX-DATA

    function updatePriority() {

        var allTodos = eval($scope.todos);
        var index = -1;
        for (i = 0 ; i < $scope.choosedRows.length; i = i + 1) {


            for (j = 0 ; j < allTodos.length ; j++) {
                if (allTodos[j].ID == $scope.choosedRows[i]) {
                    index = j;
                    break;

                }
            }
            $scope.todos[index].priority = $scope.prioritySet;
            var id = $scope.choosedRows[i];
            var priority = $scope.prioritySet;

            var post = $http({
                method: 'POST',
                url: "Default.aspx/updatePriority",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'dataType': 'json'
                },
                data: { id: id, priority: priority }
            }).then(function (response, status) {

            });

        }




    }

    function getData() {
       
        var post = $http({
            method: 'GET',
            url: "Default.aspx/getTodos",
            headers: {
                'Content-Type': 'application/json',
                'dataType': 'json'
            },
            data: {}
        }).then(function (response, status) {
            $scope.todos = response.data.d;
            for (i = 0 ; i < $scope.todos.lenght; i++)
                $scope.todos[i].ID = parseInt($scope.todos[i].ID,1000);
        });
    }

    $scope.reset = function () {
        getAndInsertData();

    }

    function getAndInsertData() {
        $http({
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/todos',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'dataType': 'json'
            }
        }).then(function (response, status) {

            var parsed = JSON.stringify(response.data);
            var last = JSON.parse(parsed);


            $http({
                method: "POST",
                url: "Default.aspx/insertTodo",
                dataType: 'json',
                headers: { "Content-Type": "application/json" },
                data: { myTodo: last }

            }).then(function (response, status) {
                getData();
                

            });
        });
    }
    //#endregion AJAX-DATA

});

app.controller('PopUpCtrl', function ($uibModalInstance, viewedData, header) {

    var $popup = this;
    $popup.viewedData = viewedData;
    $popup.header = header;



    $popup.ok = function () {
        $uibModalInstance.close($popup.viewedData);
    }




});

// for searching and filtering data
app.filter('searchFor', function () {
    return function (arr, searchString) {
        if (!searchString) {
            return arr;
        }



        var result = [];
        searchString = searchString.toLowerCase();
        angular.forEach(arr, function (item) {
            if (item.title.toLowerCase().indexOf(searchString) !== -1) {
                result.push(item);
            }
        });
        return result;
    };

});