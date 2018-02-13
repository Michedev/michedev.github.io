var app = angular.module('app')
app.controller('SkillsCtrl', function ($scope, SkillsList) {
    let self = this;
    self.skills_list = SkillsList
    $scope.$on('$viewContentLoaded', function () {
        function dynamic_grow(skill) {
            console.log(skill)
            let bad = "#e4656e"
            let medium = "#ffd166"
            let good = "#0a8754"
            let color = skill.value < 0.33 ? bad : skill.value < 0.66 ? medium : good
            $("#" + skill.id_bar).css("background-color", color)
            for (let i = 0; i <= (skill.value * 100); i++) {
                setTimeout(() => {
                    console.log(i)
                    $("#" + skill.id_bar).css("width", i+"%");
                }, i);
            }

        }
        for (let i in self.skills_list) {
            setTimeout(() => {
                var skill = self.skills_list[i]
                dynamic_grow(skill)
            }, i * 10)

        }
    });


})