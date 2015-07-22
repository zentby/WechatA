angular.module('wechataMentions', ['ui.bootstrap']);
angular.module('wechataMentions').controller('mentionsController',['$scope', '$http', '$location',function($scope, $http, $location) {
    $scope.formData = {};


    // when landing on the page, get all mentions and show them
    var loadThem = function(param) {
        $location.search('msg', param)
        $http.get('/api/assembla/testmentions/' + param)
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
    };


    $scope.loadMentions = function() {
        if (isUnread) {
            isUnread = false;
            $scope.UnreadMsg = 'Load Unread';
            loadThem('all');
        } else {
            isUnread = true;
            $scope.UnreadMsg = 'Load All';
            loadThem('unread');
        }

    };

    var searchObject = $location.search();
    var isUnread = searchObject.msg && searchObject.msg=='read';
    $scope.loadMentions();
}]);