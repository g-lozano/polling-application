'use strict';

(function() {
    angular.module('poll', ['ngResource'])
        .controller('pollCtrl', ['$scope', '$http',
            function($scope, $http) {
                $scope.options = []
                $scope.title = ''
                $scope.error_message = ''

                var str = window.location.href
                var params = str.split('?')[1]

                if (params) {
                    var id = params.split('=')[1]
                    if (id && params.split('=')[0] == 'poll_id') {
                        var info = {
                            poll_id: id
                        }

                        var test = $http.post('/api/polls', info)
                            .then(function successCallback(response) {
                                $scope.error_message = ''
                                $scope.title = response.data.title
                                $scope.options = response.data.options
                            }, function errorCallback(response) {
                                $scope.error_message = 'Poll does not exist.'
                            })
                    }
                }
                
                $scope.submit = function() {
                    alert('testing')
                }

            } // end function
        ])
})();
