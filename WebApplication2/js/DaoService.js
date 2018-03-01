
    // with ui.bootstrap -> uibModal and uibModalInstance can be used



    angular.module('TodoApp')
    .service('DaoService', DaoService);

    DaoService.$inject = ['$http'];
    function DaoService($http) {
        var dao = this;
        dao.deleteTodo = function (id) {
            $http({
                method: 'POST',
                url: "Default.aspx/DeleteTodo",

                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'dataType': 'json'
                },
                data: { id: id }
            }).then(function (response, status) {
                alert("Successfully Deleted");

            });
        }


        dao.removeChoosed = function (choosedRows) {



            $http({
                method: 'POST',
                url: "Default.aspx/DeleteTodoList",
                
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'dataType': 'json'
                },
                data: { id: choosedRows }
            }).then(function (response, status) {
                alert("Successfully Deleted");
                
            });
        }

        dao.getData = function () {

            return $http({
                method: 'POST',
                url: "Default.aspx/getTodos",
                headers: {
                    'Content-Type': 'application/json',
                    'dataType': 'json'
                },
                data : {} // data must be exist even if request type = get
                // also must be add  [ScriptMethod(UseHttpGet = true)] definition upper side of the getTodos function at c#

            }).then(function (response, status) {
                return response.data.d;

            });

        }

        dao.getAndInsertData = function () {
            return $http({
                method: 'GET',
                url: 'https://jsonplaceholder.typicode.com/todos',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'dataType': 'json'
                }

            }).then(function (response, status) {
                
                //alert(response.statusText);
                //alert(response);
                
                //var parsed = JSON.stringify(response.data);
                //var last = JSON.parse(parsed);
                var last = eval(response.data)
                

                $http({
                    method: "POST",
                    url: "Default.aspx/insertTodo",
                    dataType: 'json',
                    headers: { "Content-Type": "application/json" },
                    data: { myTodo: last }

                }).then(function (response, status) {
                    
                   
                });
              

               
            });
           
            
        }

        dao.updatePriority = function (id, priority) {
            return $http({
                method: 'GET',  // POST
                url: "Default.aspx/updatePriority",
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'dataType': 'json'
                },
                data: {}, // data: { id: id, priority: priority }
                    params: { id: id, priority: JSON.stringify(priority) } // not necessary when post is used
            }).then(function (response, status) {
                //  nothing to do for now
            });
        }
    }

