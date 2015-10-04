'use strict';

var app = angular.module("myApp", []);

app.controller("headerCtrl", function($scope){
  $scope.headerName = "Le nom dans le header";
});

app.controller("footerCtrl", function($scope){
  //...
});

app.controller("menuCtrl", function($scope){
  //...
});

app.controller("contentCtrl", function($scope){
  //...
});
