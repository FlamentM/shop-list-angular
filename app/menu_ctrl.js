'use strict';

angular.module('app.menu-controller', [])
    .controller('MenuCtrl', function ($mdSidenav, $location, mainMenu) {
        var menuCtrl = this;
        menuCtrl.mainMenu = mainMenu;

        menuCtrl.toggleSidenav = function(menuId) {
            $mdSidenav(menuId).toggle();
        };

        menuCtrl.isCurrentPath = function(link){
            return(link.href == $location.path());
        };
    });
