var app = angular.module('app')
app.controller('SkillsCtrl', function ($scope, SkillsList) {
    let self = this;
    self.skills_list = SkillsList
    $scope.$on('$viewContentLoaded', function () {
        function dynamic_grow(skill) {
            console.log(skill)
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