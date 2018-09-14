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
            description: "SIS2017 is the annual data science conference, and in 2017 was organized by University of Florence, Siena and Pisa.\nThe app was developed with Ionic, a framework on the top of Cordova, that allow to develop a mobile application like a website while Ionic adds a native look-and-feel to the application",
            date: "09/2016 to 07/2017",
            link: "https://play.google.com/store/apps/details?id=org.sis_statistica&hl=it",
            link_icon: "views/projects/static/img/playstore.png"
        },
        {
            name: "BusinessGame 2018 at Padova",
            description: "Data mining competition where the task was the prediction of wine price",
            date: "06/04/2018",
            link: "https://gitlab.com/MikeDev/business_game_2018_report",
            link_icon: "views/projects/static/img/gitlab.png"
        },
        {
            name: "BriscolaGO Gitlab project",
            description: "I started with implementing Briscola in go in order to learn the language, \
                         but after i implemented an AI based on Monte Carlo Tree Search algorithm with\
                         determinization to handle the imperfect-information game",
            date: "14/09/2018",
            link: "https://gitlab.com/MikeDev/BriscolaGo",
            link_icon: "views/projects/static/img/gitlab.png"
        }
    ]
})