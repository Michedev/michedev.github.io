var app = angular.module('app')

app.service('SkillsList', function(){
    return [
        {
            name: "Python",
            background_color: "#1a425e",
            value: 0.9,
            text_color: 'white',
            gradient: ["red", "orange"],
            path_icon: "views/skills/static/img/python.png",
            id_circle: "python-circle",
            start_angle: 0.4
        },
        {
            name: "Scala",
            background_color: "white",
            value: 0.6,
            text_color: 'black',
            gradient: ["blue", "green"],
            path_icon: "views/skills/static/img/scala.png",
            id_circle: "scala-circle",
            start_angle: 1.3
        },
        {
            name: "Java",
            background_color: "white",
            value: 0.8,
            text_color: '#ec2025',
            gradient: ["red", "blue"],
            path_icon: "views/skills/static/img/java.svg",
            id_circle: "java-circle",
            start_angle: 0.8
        },
        {
            name: "Html",
            background_color: "white",
            value: 0.5,
            text_color: 'black',
            gradient: ["red", "blue"],
            path_icon: "views/skills/static/img/html.png",
            id_circle: "html-circle",
            start_angle: 0.8
        },
    ]
})