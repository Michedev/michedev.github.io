var app = angular.module('app');
app.service('ProjectList', function(){
    return [
        {
            name : "DataGame at Padova",
            description: "Data mining competition where the task was a prediction of the number of click of videogame spots",
            date: "15/03/2018",
            link_icon: "views/projects/static/img/gitlab.png",
            link: "https://gitlab.com/MikeDev/datagame_hackatlon_padova"
        },
        {
            name : "Developement of the official Android app of SIS2017 for the University of Florence",
            description: "SIS2017 is the annual data science conference, and in 2017 was organized by University of Florence, Siena and Pisa.The app was developed with Ionic, a framework on the top of Cordova, that allow to develop a mobile application like a website while Ionic adds a native look-and-feel to the application",
            date: "09/2016 to 07/2017",
            link: "https://play.google.com/store/apps/details?id=org.sis_statistica&hl=it",
            link_icon: "views/projects/static/img/playstore.png"
        },
    ]
})