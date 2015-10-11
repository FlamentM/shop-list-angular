'use strict';

angular.module('app', [
    'ngRoute',
    'ngMaterial',
    'ngMessages',
    'app.menu-controller',
    'app.marmitton',
    'app.shop-list'
])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/shop_list', {
        title: 'Liste',
        templateUrl: 'view-shop-list/shop-list.html',
        controller: 'ShopListController',
        controllerAs: 'listCtrl'
    });

    $routeProvider.when('/marmitton', {
        title: 'Via marmitton',
        templateUrl: 'view-marmitton/marmitton.html',
        controller: 'MarmittonController',
        controllerAs: 'marmittonCtrl'
    });

    $routeProvider.otherwise({redirectTo: '/shop_list'});
}])


.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = (current.$$route) ? current.$$route.title : 'Catalog';
    });
}])

.constant("mainMenu",[
    {href: "/shop_list", title: "Liste de produits"},
    {href: "/marmitton", title: "Via marmitton"}
]);