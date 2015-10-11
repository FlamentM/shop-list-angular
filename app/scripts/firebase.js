'use strict';

app.service('firebaseService', function() {
  var connexion = new Firebase('https://shop-list-eservices.firebaseio.com/');

  this.send = function(obj){
    connexion.push(obj);
  };

  this.setProcessingFunction = function(fun){
    connexion.on('child_added', function(snapshot) {
      fun(snapshot);
    });
  };
});
