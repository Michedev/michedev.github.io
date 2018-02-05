var app = angular.module('app', ['ui.router']);

// Declare app level module which depends on views, and components

app.config(['$urlRouterProvider', function($urlRouterProvider) {
    console.log("Porcodiocane")
    $urlRouterProvider.otherwise('/home');

}]);

app.run(['$rootScope', '$state', function($rootScope, $state) {

    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
        if (to.redirectTo) {
            evt.preventDefault();
            $state.go(to.redirectTo, params, {location: 'replace'});
        }
    });

}]);