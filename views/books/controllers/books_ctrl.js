var app = angular.module('app')
app.controller('BooksCtrl', function($scope, BooksReaden){
    console.log(BooksReaden)
    let self = this
    self.books_readen = BooksReaden

})