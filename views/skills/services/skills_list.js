var app = angular.module('app')

app.service('SkillsList', function(){
    return [
        {
            name: "Python",
            background_color: "#1a425e",
            value: 0.9,
            gradient: ["red", "orange"],
            path_icon: "views/skills/static/img/python.png",
            id_circle: "python-circle"
        },
        {
            name: "fff",
            background_color: "#1a425e",
            value: 0.9,
            gradient: ["red", "orange"],
            path_icon: "views/skills/static/img/python.png",
            id_circle: "python43-circle"
        },
    ]
})