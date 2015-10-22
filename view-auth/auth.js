'use strict';

angular.module('app.auth', ['app.firebase-services'])
    .controller('AuthController', function ($scope, $location, firebaseService) {
        var authCtrl = this;
        authCtrl.connexion = {
            //email : "flament.mickael@gmail.com",
            //password : "demo"
        };
        authCtrl.inscription = {};


        if(firebaseService.getUser() !== undefined){
            $location.path('/shop_list');
        }

        authCtrl.connexionFun = function(){
            firebaseService.userAuth(authCtrl.connexion.email, authCtrl.connexion.password, function(){
                $scope.$applyAsync(function(){
                    $location.path('/shop_list');
                });
            });
        };

        authCtrl.inscriptionFun = function(){
            firebaseService.createUser(authCtrl.inscription.email, authCtrl.inscription.password, function(){
                $scope.$applyAsync(function(){
                    $location.path('/shop_list');
                });
            });
        };
    });


