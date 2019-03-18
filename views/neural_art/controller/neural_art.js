var app = angular.module('app')


app.controller('NeuralArtCtrl', function($scope, NeuralArtImages){
    let self = this
    self.imgs = NeuralArtImages
})