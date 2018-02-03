var app = angular.module('app')

app.config(($stateProvider) => {


    $stateProvider.state(
        {
            name: 'contacts',
            url: '/contacts',
            templateUrl: 'views/contacts/static/html/contacts.html'
        }
    )
})

