function shuffle(array) {
    for (var i = 0; i < array.length * 10; i++) {
        var index = i % array.length
        var tmp = array[index]
        var random_index = Math.round(Math.random() * (array.length - 1))
        array[index] = array[random_index]
        array[random_index] = tmp
    }
}

function random_margins(competences) {
    margin_left = {}
    margin_right = {}
    competences.forEach(function (element) {
        margin_left[element] = Math.random() * 2 + 1
        margin_right[element] = Math.random() * Math.random() * 3 + 1
    }, this);
    return [margin_left, margin_right]
}

scene_module.controller('competences', function ($scope) {
    $scope.competences = ['C', 'C++', 'C#', 'Python', 'Java', 'Scala', 'Kotlin', 'Maven', 'Android', 'Docker', 'TDD', 'Javascript', 'AngularJS', 'Machine Learning', 'Spark']
    shuffle($scope.competences)
    $scope.flex = { 'C': 14, 'C++': 19, 'C#': 23, 'Python': 35, 'Java': 35, 'Scala': 35, 'Kotlin': 29, 'Maven': 23, 'Android': 22, 'Docker': 30, 'TDD': 28, 'Javascript': 20, 'AngularJS': 21, 'Machine Learning': 19, 'Spark': 16 }
    $scope.max = Math.max
    $scope.color = {
        'C': '#89bdd3', 'C++': '#9ad3de', 'C#': '#6ed3cf', 'Python': '#fae596', 'Java': '#e05038', 'Scala': '#173e43', 'Kotlin': '#00a9ff', 'Maven': '#84287a', 'Android': '#77c159', 'Docker': '#37a0d3',
        'TDD': '#d4dc20', 'Javascript': '#e6af4b', 'AngularJS': '#dd1b16', 'Machine Learning': '#044389', 'Spark': '#DE691F'
    };
    var margins = random_margins($scope.competences)
    $scope.margin_left = margins[0]
    $scope.margin_right = margins[1]
}) 
