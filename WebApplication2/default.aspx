<%@ Page Title="Home Page" Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="WebApplication2.Builder" %>


<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>WebForm Ajax Test</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="scripts/angular.min.js"></script>
    <script src="scripts/angular-animate.min.js"></script><!-- animate for the pop up window-->
    <script src="scripts/angular-cookies.min.js"></script>
    <script src="scripts/angular-sanitize.min.js"></script>
    <script src="scripts/ui-bootstrap-tpls-2.5.0.min.js"></script>
    <script src="scripts/ng-csv.min.js"></script><!--for exporting data-->
    <link href="scripts/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="src/Style.css">
    <script src="src/main.js"></script>




</head>
<body data-ng-app="TodoApp" data-ng-controller="todoController as $popup">


    <div class="btn-group">
       
        <label class="btn btn-success btn-lg" data-ng-model="prioritySet" uib-btn-radio="'LOW'">Low</label>
        <label class="btn btn-warning btn-lg" data-ng-model="prioritySet" uib-btn-radio="'MEDIUM'">Medium</label>
        <label class="btn btn-danger btn-lg" data-ng-model="prioritySet" uib-btn-radio="'HIGH'">High</label>
        <div>
        <button data-ng-class = "buttonClass()" data-ng-click="updateTodo()" class="btn btn-success btn-md">Set Priority :{{prioritySet || 'null'}} </button>
       </div> 

    </div>



    <div id="filter">
        <label>Completed :</label>
       <select data-ng-model="filterComp"  data-ng-options="item for item in completeArr" data-ng-change ="cookieFunct()">
           </select>
         <label>Priority :</label>
        <select data-ng-model="filterPri"  data-ng-options="item for item in completePri" data-ng-change ="cookieFunct()">
         </select>
       <!--  <label>ID :</label>
           <select data-ng-model="filterCompareID"  data-ng-options="item for item in comparision" data-ng-change ="cookieFunct()">
         </select>
         <input type="text"  data-ng-model="filterIDvalue" placeholder="Enter id" data-ng-change ="cookieFunct()" />
        -->
         <button  data-ng-click="filterData()" class="btn btn-success btn-md"><i class="glyphicon glyphicon-filter"></i> Filter</button>
         <button  data-ng-click="clearFilter()" class="btn btn-danger btn-md"><i class="glyphicon glyphicon-minus"></i>Clear Filter</button>
     </div>

        <br>

    <div>
       


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
        <input type="text" class="search" data-ng-model="searchSmth" placeholder="Enter your search terms" data-ng-change ="cookieFunct()" />
        <button data-ng-click="removeAll()" class="btn btn-warning btn-md"> <i class="glyphicon glyphicon-trash"></i> Delete Choosed</button>
        <button data-ng-click="reset()" class="btn btn-danger btn-md">Reset Data</button>
        <button class="btn btn-default " data-ng-csv="exportChoosed()" filename="todos.csv" field-separator=";" decimal-separator="." csv-header="headerTitle()">Export Choosed <i class ="glyphicon glyphicon-download-alt"> </i></button>
        <button class="btn btn-default" data-ng-csv="exportGrid()" filename="todos.csv" field-separator=";" decimal-separator="." csv-header="headerTitle()">Export Grid <i class ="glyphicon glyphicon-download-alt"> </i></button>
        <table >
            
                <tr>

                    <th data-ng-repeat="(ele,th) in headData" data-ng-click="sortColumn(ele)" data-ng-class="sortClass(ele)">{{th}}</th>
                </tr>
            
            <!-- syntax is after the pipe Filter function:arguments  like a function call -->
            <!--ascending : +Attribute  descending : -Attribute -->
            <!--idFilter:filterIDvalue-->  <!--custom filter for ID -->
                <tr data-ng-repeat="todo in  (filteredItems = (todos | filter:filtered |  searchFor:searchSmth | orderBy:column:reverse))" data-ng-click="choose(todo.ID)" data-ng-class="chooseClass(todo.ID)" >
              
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
                        <button data-ng-click="removeData(todo.ID)" class="btn btn-warning btn-md"> <i class="glyphicon glyphicon-trash"></i> Delete</button>
                    </td>
                    <td>
                        <button data-ng-click="$popup.open(todo)" class="btn btn-info btn-md"><i class="glyphicon glyphicon-info-sign"></i> View</button>
                    </td>



                </tr>
          
        </table>
    </div>

</body>
</html>
