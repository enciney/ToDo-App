angular.module('TodoApp')
    .controller('todoController', todoController);

todoController.$inject = ['$uibModal', '$scope', '$http', '$cookies', '$timeout', 'DaoService'];
function todoController($uibModal, $scope, $http, $cookies, $timeout, DaoService) {
    getData(); // refreshing data
    $scope.headData = {
        userID: "userID",
        id: "TODO ID",
        title: "TITLE",
        completed: "COMPLETED",
        priority: "PRIORITY"
    }
    $scope.pageResponse = false; // page is not freeze
    $scope.column = 'title'; // column to sort
    $scope.filteredItems = [];  // searched items
    $scope.choosedRows = [];   //  Choosed row/s for multiple choose

    $scope.reverse = false;  // sort ordering (Ascending or Descending). Set true for descending
    $scope.todos = []; // all todo data


    $scope.prioritySet = 'None';

    // #region cookies and filter
    $scope.clearFilterOn = 0;

    $scope.completeArr = ["TRUE", "FALSE"];
    $scope.completePri = ["NONE", "LOW", "MEDIUM", "HIGH"];
    //$scope.comparision = [">", "<=", "=", "!="]; // @TODO it will be implemented - compare module

    //-------------------------------- COOKIES INITIALIZATION --------------------------------------------
    $scope.searchSmth = $cookies.get('searchSmth'); // search box from cookies
    $scope.filterComp = $cookies.get('filterComp'); // filtered Completed value from cookies
    $scope.filterPri = $cookies.get('filterPri');; // filtered Priority value from cookies
    $scope.filtered = changeFilter(); // filtered data from cookies
    //----------------------------------------------------------------------------------------------------







    $scope.cookieFunct = function () {
        $cookies.put("searchSmth", $scope.searchSmth);
        $cookies.put("filterComp", $scope.filterComp);
        $cookies.put("filterPri", $scope.filterPri);
        $cookies.put("$clearFilterOn", 0);       
    }


    // for  spin circle class
    $scope.loadingClass = function () {
        if ($scope.pageResponse)
            return "loading";
        else {
            return "flow";
        }
    }


    // for updating of the cached data 
    function changeFilter() {
        var clearOn = $cookies.get('clearFilterOn');

        if (clearOn == 0) {
            return $scope.filtered = {
                "completed": $scope.filterComp,
                "priority": $scope.filterPri,
                //"title": $scope.searchSmth
            }
        }
        else
            return $scope.filtered = {};
    }


    // callback for Filter button
    $scope.filterData = function () {
        $cookies.put("clearFilterOn", 0);
        changeFilter();

    }

    // callback for clearFilter button
    $scope.clearFilter = function () {
        $scope.filtered = {};
        $scope.$clearFilterOn = 1
        $cookies.put("clearFilterOn", 1);

    }



    // #endregion cookies and filter




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
        test();
    }


    //#endregion POPUP-MODAL


    function test()
    {
        console.log($scope.todos[0].title);
    }


    //--------------------------------------------------------- CSV  export----------------------------------------------------------
    $scope.headerTitle = function () {
        return (['Applicaion Name', 'UserID', 'TODO ID', 'TITLE', 'COMPLETED', 'PRIORITY']);
    }

    // callback for Export Choosed
    $scope.exportChoosed = function () {

        var choosedData = getChoosedTodos();
        var filt = $scope.filteredItems;
        if (filt.length <= 0)
            alert("Length lower than 0");

        return choosedData;
    }

    // callback for Export all of Grid
    $scope.exportGrid = function () {
        var filt = $scope.filteredItems;
        if (filt.length <= 0) {
            alert("Grid is empty. Exporting empty file ...");
            return;
        }
        else
            return filt;

    }

    //--------------------------------------------------------- CSV  export ----------------------------------------------------------


    //--------------------------------------------------- SORT CSS-CLASS FUNCTIONS ---------------------------------------------------- 

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

    //--------------------------------------------------- SORT CSS-CLASS FUNCTIONS ----------------------------------------------------

    //-------------------------------------------------- DELETE FUNCTIONS --------------------------------------------------------------

    $scope.removeData = function (id) {

        removeFromTodoList($scope.todos, id);
        removeFromChoosedList($scope.choosedRows, id); // deleted from choosedRows array
        DaoService.deleteTodo(id); // delete callback from oracle via service call
    }

    function removeFromTodoList(list, id) {
        list = eval(list);
        var index = -1;
        for (var i = 0; i < list.length; i++) {
            if (list[i].ID == id) {
                index = i;
                break;
            }
        }
        console.log("<<removeFromList>> index : " + index + "removed id : " + id);
        if (index > -1)
            list.splice(index, 1);

    }


    function removeFromChoosedList(list, id) {

        var index = -1;
        for (var i = 0; i < list.length; i++) {
            if (list[i] == id) {
                index = i;
                break;
            }
        }
        console.log("<<removeFromList>> index : " + index + "removed id : " + id);
        if (index > -1)
            list.splice(index, 1);

    }



    $scope.removeChoosed = function () {


        var deleted = [];
        for (var i = 0 ; i < $scope.choosedRows.length ; i++) {
            //console.log("i : " + i + " data : " + $scope.choosedRows[i]);
            deleted.push($scope.choosedRows[i]);
            removeFromTodoList($scope.todos, $scope.choosedRows[i]);


        }
        //console.log(" len : " + $scope.choosedRows.length);
        $scope.choosedRows = [];
        DaoService.removeChoosed(deleted);


    }


    //-------------------------------------------------- DELETE FUNCTIONS --------------------------------------------------------------


    //#region CHOOSE
    $scope.choose = function (id) {

        var index = $scope.choosedRows.indexOf(id);

        if (index > -1) {
            console.log("deleted to choosedList  : " + id);
            $scope.choosedRows.splice(index, 1); // first param : index , second param : how many element should be deleted

        }
        else {
            console.log("added to choosedList  : " + id);
            $scope.choosedRows.push(id);
        }

    }

    $scope.buttonClass = function () {
        var priority = $scope.prioritySet;
        if (priority == 'LOW')
            return 'low';
        else if (priority == 'MEDIUM')
            return 'medium';
        else if (priority == 'HIGH')
            return 'high';


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


    $scope.buttonKeydown = function ($event) {
        console.log("PRESSED SOMETHING");
        $scope.keyCode = $event.keyCode;
        if ($scope.keyCode == 16) {
            console.log("shift pressed");

        }
        else if ($scope.keyCode == 17)
            console.log("ctrl pressed");

    }

    $scope.buttonKeyup = function ($event) {
        console.log("PRESSED SOMETHING");
        $scope.keyCode = $event.keyCode;
        if ($scope.keyCode == 16) {
            $scope.keyCode = -1;
            console.log("shift press up");
        }

        else if ($scope.keyCode == 17) {

            $scope.keyCode = -1;
            console.log("ctrl press up ");
        }


    }

    //#endregion CHOOSE


    //#region find specific todo and choosed list
    function findTodo(id) {
        // eval function used for parse from json to string array
        var allTodos = eval($scope.todos);
        var index = -1;
        for (var i = 0 ; i < allTodos.length ; i++) {
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
        for (var i = 0 ; i < todoIDs.length ; i++) {
            for (var j = 0 ; j < allTodos.length ; j++) {
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
        console.log('updatePriority');
        var allTodos = eval($scope.todos);
        console.log(Object.keys($scope.todos).length);
        console.log($scope.todos[0].ID);
        var index = -1;
        for (var i = 0 ; i < $scope.choosedRows.length; i = i + 1) {
            for (var j = 0 ; j < allTodos.length ; j++) {
                if (allTodos[j].ID == $scope.choosedRows[i]) {
                    index = j;
                    break;

                }
            }
            $scope.todos[index].priority = $scope.prioritySet;
            var id = $scope.choosedRows[i];
            var priority = $scope.prioritySet;

            DaoService.updatePriority(id, priority);
        }
    }

    function getData() {

        DaoService.getData().then(function (response, status) {
            $scope.todos = response;
            if ($scope.pageResponse == true){
                alert("Data has been reseted successfully");
                $scope.pageResponse = false;
                $scope.choosedRows = [];
        }
        });

    }

    $scope.reset = function () {

        $scope.pageResponse = true;

        DaoService.getAndInsertData().then(function (response, status) {
            getData();
           
            
            
        });


    }


    //#endregion AJAX-DATA

}
