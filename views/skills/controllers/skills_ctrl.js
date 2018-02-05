var app = angular.module('app')
app.controller('SkillsCtrl', function ($scope, SkillsList) {
    let self = this;
    self.skills_list = SkillsList
    $scope.$on('$viewContentLoaded', function() {
        function create_circle(skill) {
            $("#" + skill.id_circle).circleProgress({
                value: skill.value,
                size: 150,
                fill: { gradient: skill.gradient },
                startAngle: skill.start_angle
            })
    
        }
        for(let i in self.skills_list){
            setTimeout(()=>{
                var skill = self.skills_list[i]
                create_circle(skill)}, i*10)
            
        }
    });
    

})