'use strict';

angular.module('app.shop-list', ['app.firebase-services'])
    .controller('ShopListController', function ($mdSidenav, $filter, $scope, $timeout, firebaseService, $location) {
        if(firebaseService.getUser() === undefined)
            $location.path("/auth");

        var listCtrl = this;

        // DECLARATION DES VARIABLES
        listCtrl.list = [];
        listCtrl.listLabel= [
            "All",
            "Others",
            "Fruits",
            "Légumes"
        ];
        listCtrl.currentList = "Others";

        firebaseService.setAddFunction(function(snapshot){
            var obj = snapshot.val();
            listCtrl.list.push({
                label : obj.label,
                parentList : obj.parentList,
                id : snapshot.key()
            });

            $timeout(function(){
                $scope.$digest(listCtrl.list);
            });
        });

        // fonction appellée pour chaque élément ajouter, y compris l'initialisation
        firebaseService.setRemoveFunction(function(snapshot){
            var obj = snapshot.val();

            var removeProduct= $filter('filter')(listCtrl.list, {
                label : obj.label,
                parentList : obj.parentList
            });

            listCtrl.list.splice(listCtrl.list.indexOf(removeProduct[0]),1);
        });


        listCtrl.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };


        listCtrl.changeCurrentList = function($event){
            listCtrl.currentList = $event.target.innerText;
            listCtrl.toggleSidenav('left');
        };

        listCtrl.addProduct = function(){
            firebaseService.push({
                label : listCtrl.productToAdd.trim(),
                parentList : listCtrl.currentList.trim()
            });
            listCtrl.productToAdd = '';
        };

        listCtrl.removeProduct = function(product){
            firebaseService.remove(product);
        };
    })
    .filter('shopListFilter', function () {
        return function (items, currentList) {
            return items.filter(function(item){
                return (currentList.toLowerCase() == 'all' || item.parentList == currentList);
            });
        };
    });

