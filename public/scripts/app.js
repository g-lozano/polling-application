'use strict';

(function() {
    angular
        .module('app', ['ngResource', 'ipCookie'])
        .controller('homeCtrl', ['$scope', '$http', 'ipCookie',
            function($scope, $http, ipCookie) {
                $scope.test = ''
                $scope.username = ''

                try {
                    $scope.username = ipCookie('pa_username')
                }catch (e) {}

                if ($scope.username)
                    $scope.view = 'home'
                else
                    $scope.view = 'login'

                $scope.type = 'my'

                $scope.showMyPolls = function() {
                    if ($scope.type == 'all')
                        $scope.type = 'my'
                }

                $scope.showAllPolls = function() {
                    if ($scope.type == 'my')
                        $scope.type = 'all'
                }

                $scope.createPoll = function() {

                }

                $scope.deletePoll = function() {

                }

                $scope.logout = function() {
                    ipCookie('pa_username', null)
                    $scope.view = 'login'
                }

                $scope.submitLogin = function() {
                    var username = document.getElementById('username').value
                    var password = document.getElementById('password').value
                    var params = {
                        username: username,
                        password: password
                    }

                    if (username && password) {
                        $scope.login_message = ''
                        var userinfo = $http.post('/login', params)
                            .then(function successCallback(response) {
                                if (response.status == 200) {
                                    return response
                                }
                            }, function errorCallback(response) {
                                console.log('no response from login script')
                            })
                        userinfo.then(function(data) {
                            $scope.view = "home"

                            var today = new Date();
                            var expiresValue = new Date(today);
                            expiresValue.setMinutes(today.getMinutes() + 120);

                            ipCookie('pa_username', data.data[0].username, {expires: 1})

                            $scope.username = ipCookie('pa_username') //data.data[0].username
                            document.getElementById('username').value = null
                            document.getElementById('password').value = null
                        })
                    }
                    else
                        $scope.login_message = 'no username and/or password'
                }
            }
        ])
})();
