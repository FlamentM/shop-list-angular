'use strict';

angular.module('app.firebase-services', [])
    .service('firebaseService', function($location) {
        var _this = this;
        _this.base_url = 'https://shop-list-eservices.firebaseio.com/';
        _this.connexion = new Firebase(_this.base_url);
        _this.user_connexion = undefined;
        _this.user = undefined;
        _this.lists = [];
        _this.removeFun = function(){console.log("removeFun must be surcharged")};
        _this.changedFun = function(){console.log("changedFun must be surcharged")};
        _this.sharedFun = function(){console.log("sharedFun must be surcharged")};

        _this.setRemoveFun = function(fun){
            _this.removeFun = fun;
        };

        _this.setChangedFun = function(fun){
            _this.changedFun = fun;
        };

        _this.setSharedFun = function(fun){
            _this.sharedFun = fun;
        };

        _this.childAddedOrChanged = function(snapshot){
            _this.changedFun(snapshot);
        };

        _this.childRemoved = function(snapshot){
            _this.removeFun(snapshot);
        };

        _this.userConnected = function(userData, callBack){
            _this.user = userData;

            _this.user_connexion = new Firebase(_this.base_url + _this.user.uid);

            _this.user_connexion.on('child_added', function(snapshot) {
                _this.childAddedOrChanged(snapshot);
            });

            _this.user_connexion.on('child_changed', function(snapshot) {
                _this.childAddedOrChanged(snapshot);
            });

            _this.user_connexion.on('child_removed', function(snapshot) {
                _this.childRemoved(snapshot);
            });

            _this.shared_connexion = new Firebase(_this.base_url + _this.user.uid + '/shared_with');

            _this.connexion.on('child_added', function(snapshot) {
                var obj = snapshot.val();

                if(typeof obj === 'object'){
                    var value = findProps('shared_with', obj);

                    value.forEach(function(list){
                        list.shared_with.forEach(function(id){
                            if(_this.user.uid == id){
                                // l'objet ne contient qu'une clé, l'id de la liste
                                list.uid = Object.keys(obj)[0];
                                list.url = _this.base_url + snapshot.key() + '/' + Object.keys(obj)[0];
                                _this.sharedFun(list);
                            }
                        })
                    })
                }
            });

            _this.connexion.on('child_changed', function(snapshot) {
                var obj = snapshot.val();
                if(typeof obj === 'object'){
                    var value = findProps('shared_with', obj);

                    value.forEach(function(list){
                        list.shared_with.forEach(function(id){
                            if(_this.user.uid == id){
                                list.uid = Object.keys(obj)[0];
                                list.url = _this.base_url + snapshot.key() + '/' + Object.keys(obj)[0];
                                _this.sharedFun(list);
                            }
                        })
                    })
                }
            });

            callBack();
        };

        function findProps(name, data, results) {
            var key, value;

            // If we weren't given a results array, create one
            if (Object.prototype.toString.call(results) !== "[object Array]") {
                results = [];
            }

            // Is it an object (including an array)?
            if (typeof data === "object") {
                // Yes, loop through its properties
                for (key in data) {
                    // Does it have an "own" property with this name?
                    // (I assume you only want "own" properties, not
                    // properties inherited from the prototype chain).
                    if (data.hasOwnProperty(key)) {
                        // Yes, get the value
                        value = data[key];

                        // Is this our property?
                        if (key === name) {
                            // Remember it
                            results.push(data);
                        }

                        // Recurse into the value?
                        if (typeof value === "object") {
                            // Yes
                            findProps(name, value, results);
                        }
                    }
                }
            }

            // All done
            return results;
        }

        _this.addNewList = function(list_name){
            var obj = {list_name : list_name};
            _this.user_connexion.push(obj);
        };

        _this.updateList = function(list){
            if(!list.url)
                var listRef = _this.user_connexion.child(list.uid);
            else
                var listRef = new Firebase(list.url);
            var obj = {};
            obj.items = [];
            obj.list_name = list.list_name;
            list.items.forEach(function(item){
               obj.items.push({label : item.label});
            });
            list.shared_with && (obj.shared_with = list.shared_with);

            listRef.update(obj);
        };

        _this.getUserIdByEmail = function(email, callback){
            _this.connexion.child('emails_to_ids/'+_this.emailToKey(email)).once('value', function(snapshot) {
                callback( snapshot );
            });
        };

        _this.emailToKey = function(emailAddress) {
            return emailAddress.replace(/\./g, ',')
        };

        _this.removeList = function(list){
            _this.user_connexion.child(list.uid).remove();
        };

        _this.createUser = function(email, password, callBack){
            _this.connexion.createUser({
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
                    _this.userAuth(email, password, callBack);
                }
            });
        };

        _this.userAuth = function(email, password, callBack){
            _this.connexion.authWithPassword({
                "email": email,
                "password": password
            }, function(error, authData) {
                if (error) {
                    alert("Login Failed");
                    console.log("Login Failed!", error);
                } else {
                    _this.userConnected(authData, callBack);
                }
            });
        };

        _this.getUser = function(){
            return _this.user;
        };

        //_this.userAuth("flament.mickael@gmail.com", "demo");
    });
