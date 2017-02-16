'use strict';

(function() {
    angular.module('poll', ['ngResource'])
        .controller('pollCtrl', ['$scope', '$http',
            function($scope, $http) {
                $scope.testoptions = ['one', 'two', 'three']

                // console.log(window.location.href)
                var str = window.location.href
                var params = str.split('?')[1]
                if (params) {
                    var id = params.split('=')[1]
                    if (id && params.split('=')[0] == 'poll_id') {
                        var info = {
                            poll_id: id
                        }
                        $http.post('/api/polls', info)
                            .then(function successCallback(response) {
                                console.log('success')
                            })
                    }
                }
            } // end function
        ])
})();
