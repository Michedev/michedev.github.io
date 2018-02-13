var app = angular.module('app')
app.controller('HomeCtrl', function($scope){
    let self = this;
    self.imgs = [
        {
            id: 0,
            path: 'views/home/static/img/skill.jpg',
            text: "Skills"
        },
        {
            id: 1,
            path: 'views/home/static/img/books.jpg',
            text: 'Books'
        }
    ]
    self.grey_others = (id_img) => {
        for(let i in self.imgs){
            let img = self.imgs[i]
            if(img.id != id_img){
                $('#home-img-container-'+img.id).css("filter", "grayscale(100%)");
            } else {
                $('#home-text-'+img.id).css("visibility", "visible");
            }
        }
        
    }
    self.ungrey_others = (id_img) => {
        for(let i in self.imgs){
            let img = self.imgs[i]
            if(img.id != id_img){
                $('#home-img-container-'+img.id).css("filter", "none");
            } else {
                $('#home-text-'+img.id).css("visibility", "hidden");
            }
        }
    }
})