var wechataMentions = angular.module('wechataMentions', []);

function mentionsController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all mentions and show them
    $http.get('/api/assembla/mentions')
        .success(function(data) {
            if (data === 'null') {
                $scope.hasMentions = false;
                return;
            }
            $scope.hasMentions = true;
            $scope.mentions = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}