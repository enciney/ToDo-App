


    angular.module('TodoApp', ['ui.bootstrap', 'ngCookies', 'ngAnimate', 'ngCsv'])   
    .filter('searchFor', searchFor)// for searching and filtering data
    //.filter('idFilter', idFilter)
    ;

   


function searchFor () {

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

}


// custom filter for ID  -- discarded because of can not use
// the custom filter with the ng-click
function idFilter() {

    return function (arr, value) {

        if (!value) {
            return arr;
        }
        value = parseInt(value);

        var temp = [];

        for (var i = 0 ; i < arr.length  ; i++) {
            if (arr[i].ID > value)
                temp.push(arr[i]);

        }
        return temp;


    };

}

