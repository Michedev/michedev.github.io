var app = angular.module('app');

app.config(function($stateProvider){
    $stateProvider.state(
        {
            name: 'home',
            url: '/home',
            templateUrl: 'views/home/static/html/home.html',
            controller: 'HomeCtrl as homeCtrl'
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
    )
    .state(
        {
            name: 'books',
            url: '/books',
            templateUrl: 'views/books/static/html/books.html',
            controller: 'BooksCtrl as booksCtrl'
        }
    )
    .state(
        {
            name: 'projects',
            url: '/projects',
            templateUrl: 'views/projects/static/html/projects.html',
            controller: 'ProjectsCtrl as projectsCtrl'
        }
    );
})