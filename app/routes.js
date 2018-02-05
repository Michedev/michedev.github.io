var app = angular.module('app');

app.config(function($stateProvider){
    console.log("mannaggia a gesu")
    $stateProvider.state(
        {
            name: 'home',
            url: '/home',
            template: '<h1>Default page</h1>'
        }
    )
    .state(
        {
            name: 'contacts',
            url: '/contacts',
            templateUrl: 'views/contacts/static/html/contacts.html',
            controller: 'ContactsCtrl'
        }
    );
})


console.log("porcamadonna")