'use strict';

var app = angular.module("myApp", ['ngMaterial']);

/*
  les objets seront sous forme : {
    list_label = "nom de la list",
    label = ""
  }

 */


app.controller("listCtrl", ['$scope', '$mdSidenav', 'firebaseService', function($scope, $mdSidenav, firebaseService){
  $scope.headerName = "Le nom dans le header";
  $scope.list = [];
  $scope.listLabel= [
    "All",
    "Others",
    "Fruits",
    "Légumes"
  ];
  $scope.currentList = "Others";

  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };


  $scope.changeCurrentList = function($event){
    $scope.currentList = $event.target.innerText;
  };

  firebaseService.setProcessingFunction(function(snapshot){
    $scope.list.push({
      "value" : snapshot.val(),
      "snapshot" : snapshot
    });
  });

  $scope.send = function(){
    
  };
}]);
