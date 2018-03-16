var app = angular.module('app');

app.controller('ProjectsCtrl', function($scope, ProjectList){
    let self = $scope
    self.project_list = ProjectList
})