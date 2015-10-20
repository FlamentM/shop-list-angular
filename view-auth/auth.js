'use strict';

angular.module('app.auth', ['app.firebase-services'])
    .controller('AuthController', function (firebaseService) {
        var authCtrl = this;
        authCtrl.connexion = {};
        authCtrl.inscription = {};
        console.log(firebaseService.getUser());
        if(firebaseService.getUser() !== undefined){
            $location.path('/shop_list');
        }

        authCtrl.connexionFun = function(){
            firebaseService.userAuth(authCtrl.connexion.email, authCtrl.connexion.password);
        };

        authCtrl.inscriptionFun = function(){
            alert('connexion');
        };
    });


