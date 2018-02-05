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
    )
    .state(
        {
            name: 'skills',
            url: '/skills',
            templateUrl: 'views/skills/static/html/skills.html',
            controller: 'SkillsCtrl as skillsCtrl'
        }
    );
})


console.log("porcamadonna")