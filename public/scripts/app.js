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
                }
                catch (e) {}

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

                $scope.viewSignUp = function() {
                    $scope.view = 'signup'
                }

                $scope.submitSignUp = function() {

                    $scope.signup_message = ""
                    var new_username = document.getElementById('new_username').value
                    var new_password1 = document.getElementById('new_password1').value
                    var new_password2 = document.getElementById('new_password2').value

                    if ((new_username && new_password1) && (new_password1 == new_password2)) {
                        var params = {
                            username: new_username,
                            password: new_password1
                        }
                        var success = $http.post('/signup', params)
                            .then(function successCallback(response) {
                                if (response.status == 200) {
                                    return response
                                    alert(JSON.stringify(response))
                                }
                            }, function errorCallback(response) {
                                console.log('no response from signup script')
                            })

                        success.then(function(data) {
                            if (data.data.success) {
                                var today = new Date();
                                var expiresValue = new Date(today);
                                expiresValue.setMinutes(today.getMinutes() + 120) //2 hours

                                ipCookie('pa_username', data.config.data.username, {
                                    expires: expiresValue
                                })
                                $scope.username = ipCookie('pa_username')
                                
                                document.getElementById('signup_form').reset()
                                $scope.view = 'home'
                                $scope.signup_message = ""
                            }
                            else
                                $scope.signup_message = "User exists."
                        })
                    }
                    else if (!new_username) {
                        $scope.signup_message = 'No username entered.'
                    }
                    else if (new_password1 != new_password2) {
                        $scope.signup_message = 'Passwords do not match.'
                    }
                    else
                        $scope.signup_message = 'Please fill in the whole form.'

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
                                // return response
                                $scope.view = "home"

                                var today = new Date();
                                var expiresValue = new Date(today);
                                expiresValue.setMinutes(today.getMinutes() + 120) //2 hours

                                ipCookie('pa_username', response.data[0].username, {
                                    expires: expiresValue
                                })

                                $scope.username = ipCookie('pa_username')
                                document.getElementById('login_form').reset()
                            }, function errorCallback(response) {
                                $scope.login_message = 'Invalid login information.'
                            })
                    }
                    else
                        $scope.login_message = 'no username and/or password'
                }
            }
        ])
})();
