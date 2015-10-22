'use strict';

angular.module('app.shop-list', ['app.firebase-services'])
    .controller('ShopListController', function ($mdSidenav, $filter, $scope, $timeout, firebaseService, $location) {
        if(!firebaseService.getUser())
            $location.path("/auth");

        var listCtrl = this;

        // DECLARATION DES VARIABLES
        listCtrl.lists = firebaseService.lists || [];
        listCtrl.shared_lists = [];
        listCtrl.currentList = undefined;
        listCtrl.listToAdd = undefined;
        listCtrl.productToAdd = undefined;
        listCtrl.listToShare = undefined;
        listCtrl.user = firebaseService.getUser();

        firebaseService.setChangedFun(function(snapshot){
            $scope.$applyAsync(function(){
                var obj = snapshot.val();
                obj.uid = snapshot.key();
                var already_present = false;

                for(var i = 0, il = listCtrl.lists.length ; i < il ; i++){
                    if(listCtrl.lists[i].uid == obj.uid){
                        listCtrl.lists[i] = obj;
                        listCtrl.currentList = listCtrl.lists[i];
                        already_present = true;
                        break;
                    }
                }

                if(!already_present){
                    listCtrl.lists.push(obj);
                    listCtrl.currentList = listCtrl.lists[listCtrl.lists.length - 1];
                }
            });
        });

        firebaseService.setRemoveFun(function(snapshot){
            $scope.$applyAsync(function(){
                var uid = snapshot.key();

                for(var i = 0, il = listCtrl.lists.length ; i < il ; i++){
                    if(listCtrl.lists[i].uid == uid){
                        listCtrl.lists.splice(i, 1);
                        break;
                    }
                }
            });
        });

        firebaseService.setSharedFun(function(list){
            $scope.$applyAsync(function(){
                var exist = false;

                for(var i = 0, il = listCtrl.shared_lists.length ; i < il ; i++){
                    if(listCtrl.shared_lists[i].list_name == list.list_name && list.items != listCtrl.shared_lists[i].items){
                        listCtrl.shared_lists[i] = list;
                        listCtrl.currentList = listCtrl.shared_lists[i];
                        exist = true;
                        break;
                    }
                }

                if(!exist)
                    listCtrl.shared_lists.push(list);
            });
        });

        listCtrl.shareList = function(list){
            var email = window.prompt("Entrez l'email de votre ami");

            if(email){
                listCtrl.listToShare = list;
                listCtrl.shareWith(email);
            }
        };

        listCtrl.shareWith = function(email){
            firebaseService.getUserIdByEmail(email, function(snapshot){
                if(listCtrl.listToShare){
                    var uid = snapshot.val() || undefined;

                    if(uid){
                        if(!Array.isArray(listCtrl.listToShare.shared_with)) listCtrl.listToShare.shared_with = [];
                        // pas encore partagé
                        if(listCtrl.listToShare.shared_with.indexOf(uid) == -1){
                            if(uid != firebaseService.user.uid){
                                listCtrl.listToShare.shared_with.push(uid);
                                firebaseService.updateList(listCtrl.listToShare);
                                listCtrl.listToShare = undefined;
                            }
                            else
                                alert('Partager avec vous même ? Vraiment !')
                        }
                        else
                            alert('Deja partagé avec cet utilisateur');
                    }
                    else
                        alert('Utilisateur inexistant');
                }
            });
        };

        listCtrl.addProduct = function(){
            if(!Array.isArray(listCtrl.currentList.items)) listCtrl.currentList.items = [];
            listCtrl.currentList.items.push({label:listCtrl.productToAdd});
            firebaseService.updateList(listCtrl.currentList);
            listCtrl.productToAdd = undefined;
        };

        listCtrl.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };

        listCtrl.changeCurrentList = function(list){
            listCtrl.currentList = list;
            listCtrl.toggleSidenav('left');
        };

        listCtrl.addList = function(){
            firebaseService.addNewList(listCtrl.listToAdd);
            listCtrl.listToAdd = undefined;
            document.getElementById('product-to-add').focus();
        };

        listCtrl.removeList = function(list){
            firebaseService.removeList(list);
            if(list == listCtrl.currentList)
                listCtrl.currentList = listCtrl.lists[0] || undefined;
        };

        listCtrl.removeItem = function(item){
            listCtrl.currentList.items.splice(listCtrl.currentList.items.indexOf(item), 1);
            firebaseService.updateList(listCtrl.currentList);
        };
        /*
        listCtrl.addProduct = function(){
            firebaseService.push({
                label : listCtrl.productToAdd.trim(),
                parentList : listCtrl.currentList.trim()
            });
            listCtrl.productToAdd = '';
        };

        listCtrl.removeProduct = function(product){
            firebaseService.remove(product);
        };*/
    })
    .filter('shopListFilter', function () {
        return function (items, currentList) {
            return items.filter(function(item){
                return (currentList.toLowerCase() == 'all' || item.parentList == currentList);
            });
        };
    });

