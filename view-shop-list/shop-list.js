'use strict';

angular.module('app.shop-list', ['app.firebase-services'])
    .controller('ShopListController', function ($mdSidenav, $filter, $scope, $timeout, firebaseService) {
        var listCtrl = this;

        // DECLARATION DES VARIABLES
        listCtrl.list = [];
        listCtrl.listLabel= [
            "All",
            "Others",
            "Fruits",
            "L�gumes"
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

        // fonction appell�e pour chaque �l�ment ajouter, y compris l'initialisation
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
    });

