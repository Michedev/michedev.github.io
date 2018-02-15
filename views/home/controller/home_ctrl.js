var app = angular.module('app')

function resize_img(id_img, delta_w, delta_h){
    $("#" + id_img).animate({

        height: '+='+ delta_h + 'px',
        width: '+='+ delta_w +'px'
    });

}

app.controller('HomeCtrl', function($scope){
    let self = this;
    self.imgs = [
        {
            id: 0,
            path: 'views/home/static/img/skill.png',
            text: "Skills"
        },
        {
            id: 1,
            path: 'views/home/static/img/books.jpg',
            text: 'Books'
        },
        {
            id: 3,
            path: 'views/home/static/img/projects.jpg',
            text: 'Projects'
        },
        {
            id: 2,
            path: 'views/home/static/img/contacts.png',
            text: 'Contacts'
        },
    ]
    self.grey_others = (id_img) => {
        for(let i in self.imgs){
            let img = self.imgs[i]
            if(img.id != id_img){
                $('#home-img-container-'+img.id).css("filter", "grayscale(100%)");
            } else {
                $('#home-text-'+img.id).css("visibility", "visible");
                resize_img('home-img-'+img.id, 30, 30)
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
                resize_img('home-img-'+img.id, -30, -30)

            }
        }
    }
})