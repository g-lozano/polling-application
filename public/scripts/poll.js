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
                    if (id) {
                        var url = '/api/polls?=poll_id=' + id
                        $http.get(url)
                            .then(function successCallback(response) {
                                console.log('success')
                            })
                    }
                }
            } // end function
        ])
})();
