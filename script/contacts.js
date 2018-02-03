
scene_module.controller('contacts', function($scope){
    $scope.contacts = ['Facebook', 'Linkedin', 'Skype', 'Github', 'Twitter', 'mik3dev@gmail.com']
    $scope.icon = {'Facebook': '#4867AA' , 'Linkedin': '#0077B5', 'Skype': '#00AFF0', 'Github': '#1A1A1A', 'Twitter': '#1DA1F2', 'mik3dev@gmail.com': '#D8012A'}
    $scope.link = {'Facebook': 'https://www.facebook.com/michele.devita2' , 'Linkedin': 'https://www.linkedin.com/in/michele-de-vita-582336bb', 'Skype': 'skype:live:mdv1994', 'Github': 'https://github.com/Michedev', 'Twitter': 'https://twitter.com/lMike94l', 'mik3dev@gmail.com': 'writeto:mik3dev@gmail.com'}
})