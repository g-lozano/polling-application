'use strict';

(function() {
    angular.module('poll', ['ngResource', 'ipCookie'])
        .controller('pollCtrl', ['$scope', '$http', 'ipCookie',
            function($scope, $http, ipCookie) {
                $scope.options = []
                $scope.title = ''
                $scope.error_message = ''
                var pollData = {}

                var str = window.location.href
                var params = str.split('?')[1]
                var id = params.split('=')[1]

                if (params) {

                    if (id && params.split('=')[0] == 'poll_id') {
                        var info = {
                            poll_id: id
                        }

                        var test = $http.post('/api/polls', info)
                            .then(function successCallback(response) {
                                $scope.error_message = ''
                                $scope.title = response.data.title
                                $scope.options = response.data.options
                                pollData = response.data
                            }, function errorCallback(response) {
                                $scope.error_message = 'Poll does not exist.'
                            })
                    }
                }

                $scope.submit = function() {
                    var count = 0
                    var node = document.getElementById('poll')
                    for (var i = 2; i < node.childNodes.length - 2; i += 2) {
                        if (node.childNodes[i].childNodes[1].childNodes[1].checked)
                            break
                        count++
                    }

                    pollData.options[count].votes += 1

                    var data = {
                        type: "increment",
                        index: count,
                        id: id,
                        pollData: pollData
                    }

                    $http.post('/api/polls', data)
                        .then(function successCallback(response) {
                            document.getElementById('submit_button').disabled = true
                        })
                }

                var init = function() {
                    var username = ''
                    try {
                        username = ipCookie('pa_username')
                    }
                    catch (e) {}

                    if (username) {
                        var info = {
                            username: username
                        }

                        $http.post('/check_user', info)
                            .then(function successCallback(response) {
                                $scope.loggedIn = true
                            }, function errorCallback(response) {
                                $scope.loggedIn = false
                            })
                    }
                }

                init()

            } // end function
        ])
})();
