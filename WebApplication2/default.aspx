<%@ Page Title="Home Page" Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="WebApplication2.Builder" %>


<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>WebForm Ajax Test</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <script src="scripts/angular.min.js"></script>
    <script src="scripts/angular-animate.min.js"></script>
    <!-- animate for the pop up window-->
    <script src="scripts/angular-sanitize.min.js"></script>
    <script src="scripts/ui-bootstrap-tpls-2.5.0.min.js"></script>
    <script src="scripts/ng-csv.min.js"></script>
    <!--for exporting data-->
    <link href="scripts/bootstrap.min.css" rel="stylesheet" />



    <link rel="stylesheet" type="text/css" href="Style.css">
    <script src="js/main.js"></script>




</head>
<body data-ng-app="TodoApp" data-ng-controller="todoController as $popup">


    <div class="btn-group">
        <button data-ng-click="updateTodo()" class="btn btn-success btn-md">Todo Priority Set</button>
        <label class="btn btn-success btn-lg" data-ng-model="prioritySet" uib-btn-radio="'LOW'">Low</label>
        <label class="btn btn-warning btn-lg" data-ng-model="prioritySet" uib-btn-radio="'MEDIUM'">Medium</label>
        <label class="btn btn-danger btn-lg" data-ng-model="prioritySet" uib-btn-radio="'HIGH'">High</label>
        <pre>{{prioritySet || 'null'}}</pre>

    </div>


    <div>
        <!--variable of the ng-model  is the searched value  -->


        <!--#region Modal-->
        <script type="text/ng-template" id="view.html">
        <div class="modal-header">
                <h3 class="modal-title" id="modal-title">#ToDo-{{$popup.viewedData.ID}}</h3>
        </div>  
               
        <div class="modal-body">
           <table>
            <thead>
             <tr>
        
                 <th  data-ng-repeat="head  in $popup.header">
                    {{head}} </th>
      
	        </tr>
           </thead>
        <tbody>
            <tr>
                 <td>{{$popup.viewedData.userID}}  </td>
                 <td>{{$popup.viewedData.ID}}  </td>
                 <td>{{$popup.viewedData.title}}  </td>
                 <td>{{$popup.viewedData.completed}}  </td>
                <td>{{$popup.viewedData.priority}}  </td>
           </tr>
        </tbody>
        </table>
        </div>

         <div class="modal-footer">
            <button class="btn btn-primary" type="button" ng-click="$popup.ok()">OK</button>            
        </div>

        </script>
        <!--#endregion Modal-->





        <label>Search Title :</label>
        <input type="text" class="search" data-ng-model="searchSmth" data-ng-change="filterTitle()" placeholder="Enter your search terms" />
        <button data-ng-click="removeAll()" class="btn btn-warning btn-md">Delete Choosed</button>
        <button data-ng-click="reset()" class="btn btn-danger btn-md">Reset Data</button>
        <button class="btn btn-default" data-ng-csv="exportChoosed()" filename="todos.csv" field-separator=";" decimal-separator="." csv-header="headerTitle()">Export Choosed</button>
        <button class="btn btn-default" data-ng-csv="exportGrid()" filename="todos.csv" field-separator=";" decimal-separator="." csv-header="headerTitle()">Export Grid</button>
        <table >
            
                <tr>

                    <th data-ng-repeat="(ele,th) in headData" data-ng-click="sortColumn(ele)" data-ng-class="sortClass(ele)">{{th}}</th>
                </tr>
            
            <!-- syntax is after the pipe Filter function:arguments  like a function call -->
            <!--ascending : +Attribute  descending : -Attribute -->
            
                <!-- searchFor:searchSmth -->
                <tr data-ng-repeat="todo in  (filteredItems = (todos | filter:searchSmth | orderBy:column:reverse))" data-ng-click="choose(todo.ID)" data-ng-class="chooseClass(todo.ID)">
                    <td>{{todo.userID}}
                    </td>
                    <td>{{todo.ID}}
                    </td>
                    <td>{{todo.title}}
                    </td>
                    <td>{{todo.completed}}
                    </td>
                    <td>{{todo.priority}}
                    </td>
                    <td>
                        <button data-ng-click="removeData(todo.ID)" class="btn btn-warning btn-md">Delete</button>
                    </td>
                    <td>
                        <button data-ng-click="$popup.open(todo)" class="btn btn-info btn-md">View</button>
                    </td>



                </tr>
          
        </table>
    </div>

</body>
</html>
