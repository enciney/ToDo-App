# To-Do Api

## Goal
To achive a To-Do api using given data source.

## Data
You could get data as like here. Also please check following address https://jsonplaceholder.typicode.com/

```javascript
var root = 'https://jsonplaceholder.typicode.com';
$.ajax({
  url: root + '/todos',
  method: 'GET'
}).then(function(data) {
  console.log(data);
});
```

## Objectives

* List all to-do items from source in page.
* Enable user to order items by title
* Enable user to filter completed items and remember that selection wheter user visit page again.
* Enable user to search inside items titles (case insensitive)
* Enable user to select an item and delete
* Enable user to delete an item
* Enable user to change item priority and show them in different colors (High, Medium, Low)
* Enable user to view a single item
* Enable user to export items as csv file.
* Final page must be responsive, must work both for smart phones and destops. 

## Prefered Technologies

* Angular 1.6
* Bootstrap 3

note: clone this repo and push you project on a public github repository.
