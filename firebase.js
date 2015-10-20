'use strict';

angular.module('app.firebase-services', [])
    .service('firebaseService', function($location) {
        var connexion = new Firebase('https://shop-list-eservices.firebaseio.com/');
        var user = undefined;
        var _this = this;

        this.push = function(obj){
            connexion.push(obj);
        };

        this.remove = function(obj){
            connexion.child(obj.id).remove();
        };

        this.setAddFunction = function(fun){
            connexion.on('child_added', function(snapshot) {
                fun(snapshot);
            });
        };

        this.setRemoveFunction = function(fun){
            connexion.on('child_removed', function(snapshot) {
                fun(snapshot);
            });
        };

        this.createUser = function(email, password){
            connexion.createUser({
                email: email,
                password: password
            }, function(error, userData) {
                if (error) {
                    switch (error.code) {
                        case "EMAIL_TAKEN":
                            console.log("The new user account cannot be created because the email is already in use.");
                            break;
                        case "INVALID_EMAIL":
                            console.log("The specified email is not a valid email.");
                            break;
                        default:
                            console.log("Error creating user:", error);
                    }
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);

                }
            });
        };

        this.userAuth = function(email, password){
            connexion.authWithPassword({
                "email": email,
                "password": password
            }, function(error, authData) {
                if (error) {
                    alert("Login Failed");
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    console.log(authData);
                    _this.user = authData;
                    $location.path("/shop_list");
                }
            });
        };

        this.getUser = function(){
            return this.user;
        }
    });
