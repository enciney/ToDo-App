<%@ Page Title="Home Page" Language="C#" AutoEventWireup="true" CodeBehind="default.aspx.cs" Inherits="WebApplication2.Builder"  %>


<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>TodoApp</title>
    <meta charset="utf-8" />
    <script src="scripts/angular.min.js"></script><!--Angular main js file-->
    <script src="scripts/angular-animate.min.js"></script><!-- animate for the pop up window-->
    <script src="scripts/angular-cookies.min.js"></script> <!--ngCookies-$cookies -->
    
    <script src="scripts/ui-bootstrap-tpls-2.5.0.min.js"></script> <!-- for modal and popup -->
    <script src="scripts/ng-csv.min.js"></script><!--for exporting data-->
    <link href="scripts/bootstrap.min.css" rel="stylesheet" /> <!-- all of the User interface  view as css -->
    <script src="scripts/angular-sanitize.min.js"></script>  <!--for working inline html -angular code with ng-bind,Using for ng-csv; ng-csv is using ng-sanitize as a dependency --> 


    <!-- user defined code-->
    <link rel="stylesheet" type="text/css" href="src/Style.css">
    <script src="js/main.js"></script>
    <script src="js/todoController.js"></script>
    <script src="js\PopUpCtrl.js"></script>
    <script src="js/DaoService.js"></script>
    
    


</head>
<body data-ng-app="TodoApp" ng-controller="todoController as $popup" data-ng-keydown = "buttonKeydown($event)" data-ng-keyup ="buttonKeyup($event)" >


    <div data-ng-class ="loadingClass()"></div>

  <!--  <div class="btn-group">
       
        <label class="btn btn-success btn-lg" data-ng-model="prioritySet" data-uib-btn-radio="'LOW'">Low</label>
        <label class="btn btn-warning btn-lg" data-ng-model="prioritySet" data-uib-btn-radio="'MEDIUM'">Medium</label>
        <label class="btn btn-danger btn-lg" data-ng-model="prioritySet" data-uib-btn-radio="'HIGH'">High</label>
        <div>
        <button data-ng-class = "buttonClass()" data-ng-click="updateTodo()" class="btn btn-success btn-md">Priority :{{prioritySet || 'null'}} </button>
       </div> 

    </div>
    -->


    <div id="filter" >
        <label>Completed :</label>
       <select data-ng-model="filterComp"  data-ng-options="item for item in completeArr" data-ng-change ="cookieFunct()"> <!-- ng-option for provide data to list box , and ng-change triggered when any changing of the data-->
           </select>
         <label>Priority :</label>
        <select data-ng-model="filterPri"  data-ng-options="item for item in completePri" data-ng-change ="cookieFunct()">
         </select>
      
         <button  data-ng-click="filterData()" class="btn btn-success btn-md"><i class="glyphicon glyphicon-filter"></i> Filter</button>
         <button  data-ng-click="clearFilter()" class="btn btn-danger btn-md"><i class="glyphicon glyphicon-minus"></i>Clear Filter</button>
   
        <div class="btn-group" uib-dropdown is-open="status.isopen">
            <button id="single-button" type="button" class="btn btn-md" data-ng-class = "buttonClass()"  uib-dropdown-toggle ng-disabled="disabled">
                Priority : {{prioritySet || 'null'}} <span class="caret"></span>
            </button>
            <button  data-ng-click="updateTodo()" class="btn btn-warning btn-md"> <i class="glyphicon glyphicon-pencil"></i> Set </button>
            <ul class="dropdown-menu" uib-dropdown-menu role="menu" aria-labelledby="single-buttons">
                <li role="menuitem"> <a  data-ng-model="prioritySet" data-uib-btn-radio="'LOW'">Low</a> </li>
                <li role="menuitem"> <a  data-ng-model="prioritySet" data-uib-btn-radio="'MEDIUM'">Medium</a> </li>
                <li role="menuitem"> <a data-ng-model="prioritySet" data-uib-btn-radio="'HIGH'">High</a></li>
       
            </ul>
        </div>
        
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
        <button data-ng-click="removeChoosed()" class="btn btn-warning btn-md"> <i class="glyphicon glyphicon-trash"></i> Delete Choosed</button>
        <button data-ng-click="reset()" class="btn btn-danger btn-md">Reset Data</button>
        <button class="btn btn-default " data-ng-csv="exportChoosed()" data-filename="todos.csv" data-field-separator=";" data-decimal-separator="." data-csv-header="headerTitle()">Export Choosed <i class ="glyphicon glyphicon-download-alt"> </i></button>
        <button class="btn btn-default" data-ng-csv="exportGrid()" data-filename="todos.csv" data-field-separator=";" data-decimal-separator="." data-csv-header="headerTitle()">Export Grid <i class ="glyphicon glyphicon-download-alt"> </i></button>
        
   <%--<list-todo my-todo = "todos"  head-data = "headData"  funct ="sortClass()"  ></list-todo>--%>
      
          <!-- syntax is after the pipe Filter function:arguments  like a function call -->
            <!--ascending : +Attribute  descending : -Attribute -->
            <!--idFilter:filterIDvalue-->  <!--custom filter for ID -->


    <table>
            
                <tr>

                    <th data-ng-repeat="(ele,th) in headData" data-ng-click="sortColumn(ele)" data-ng-class="sortClass(ele)">{{th}}</th>
                </tr>
          
          
             
       
                 <tr data-ng-repeat="todo in  (filteredItems = (todos | filter:filtered |  filter:searchSmth |  orderBy:column:reverse))" data-ng-click="choose(todo.ID)" data-ng-class="chooseClass(todo.ID)"  >
              <%-- searchfor : searchSmth is working as a same  --%>
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
      

   <!--     <textarea  cols="80"  rows="10" >        
        {{filtered | json}}
        </textarea>  -->
    </div>

</body>
</html>
