'use strict';

(function() {
    angular
        .module('app', ['ngResource'])
        .controller('homeCtrl', ['$scope',
            '$resource',
            function($scope, $resource) {
                $scope.test = 'hello from index'
                $scope.username = 'temp'
            }
        ])
        .controller('loginCtrl', ['$scope',
            '$http',
            function($scope, $http) {

                $scope.test = 'hello from login'

                $scope.submitLogin = function() { //
                    
                    var username = document.getElementById('username').value
                    var password = document.getElementById('password').value
                    var params = {
                        username: username,
                        password: password
                    }

                    if (username && password) {
                        $http.post('/login', params)
                        .then(function successCallback(response) {
                            // console.log(response)
                            
                            if (response.data == 'OK') {
                                window.location.href = '/'
                                //use service to set username
                            }
                            
                           
                        }, function errorCallback(response) {
                            console.log('failed to connect')
                        })
                    }
                }
            }
        ])
})();
