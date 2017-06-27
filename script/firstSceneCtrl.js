scene_module.controller('firstSceneCtrl', function($scope){
    $scope.num_click_img = 0
    $scope.update = function(){
        if($scope.num_click_img == 3){
            document.getElementById('myimg').src = 'backgrounds/easter-egg.jpg'
        }
        else{
            $scope.num_click_img += 1
        }
    }
})