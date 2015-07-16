angular.module('wechataMentions', ['ui.bootstrap']);
angular.module('wechataMentions').controller('mentionsController',function($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all mentions and show them
    var loadThem = function(param) {
        $http.get('/api/assembla/mentions/' + param)
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


    var isUnread = true;
    $scope.UnreadMsg = 'Load All';
    loadThem('unread');
    $scope.loadMentions = function() {
        if (isUnread) {
            isUnread = false;
            $scope.UnreadMsg = 'Load Unread';
            loadThem('read');
        } else {
            isUnread = true;
            $scope.UnreadMsg = 'Load All';
            loadThem('unread');
        }

    };
})