var app = angular.module('app')
app.controller('BooksCtrl', function($scope, BooksReaden, BooksToFinish){
    console.log(BooksReaden)
    let self = this
    self.readen = BooksReaden
    self.to_finish = BooksToFinish

    self.hightlight_card = (id_card) => {
        $("#" + id_card).css('background-color', "rgba(255, 255, 255, 0.75)").addClass("mdl-card mdl-shadow--2dp")

    }

    self.de_hightlight_card = (id_card) => {
        $("#" + id_card).css('background-color', "rgba(255, 255, 255, 0.5)").removeClass("mdl-card mdl-shadow--2dp")
    }
})