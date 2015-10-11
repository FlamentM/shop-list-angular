'use strict';

angular.module('app.firebase-services', [])
.service('firebaseService', function() {
    var connexion = new Firebase('https://shop-list-eservices.firebaseio.com/');

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
});
