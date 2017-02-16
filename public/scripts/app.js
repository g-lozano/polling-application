'use strict';

(function() {
    angular
        .module('app', ['ngResource', 'ipCookie'])
        .controller('homeCtrl', ['$scope', '$http', 'ipCookie',
            function($scope, $http, ipCookie) {

                var checkUser = function() {
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
                                $scope.view = 'home'
                            }, function errorCallback(response) {
                                ipCookie('pa_username', null)
                                $scope.view = 'login'
                            })
                    }
                    else
                        $scope.view = 'login'
                }

                $scope.test = ''
                $scope.username = ''
                $scope.isUser = false
                $scope.options = []
                $scope.userPolls = []

                try {
                    $scope.username = ipCookie('pa_username')
                }
                catch (e) {}

                if ($scope.username) {
                    checkUser()
                }
                else
                    $scope.view = 'login'

                $scope.type = 'my'

                var loadPolls = function() {
                    var params = {
                        type: 'user',
                        username: ipCookie('pa_username')
                    }
                    $http.post('/api/polls', params)
                        .then(function successCallback(response) {
                            $scope.userPolls = response.data
                        })
                }

                $scope.showMyPolls = function() {
                    $scope.type = 'my'
                }

                $scope.showAllPolls = function() {
                    $scope.type = 'all'
                }

                $scope.createPoll = function() {
                    $scope.type = 'create_poll'
                }

                $scope.insertPoll = function() {
                    $scope.options_message = ''
                    var title = document.getElementById('title').value
                    var optionsNode = document.getElementById('options')
                    var options = []

                    var input1 = optionsNode.childNodes[1].childNodes[1].value
                    var input2 = optionsNode.childNodes[5].childNodes[1].value

                    if (!title) {
                        $scope.options_message = 'Please add a title.'
                    }
                    else if (input1 && input2) {
                        options.push(input1)
                        options.push(input2)
                        if (optionsNode.childNodes.length > 9) {
                            for (var i = 9; i < optionsNode.childNodes.length; i = i + 2) {
                                if (optionsNode.childNodes[i].childNodes[1].value)
                                    options.push(optionsNode.childNodes[i].childNodes[1].value)
                            }
                        }

                        var params = {
                            type: 'insert',
                            username: ipCookie('pa_username'),
                            title: title,
                            options: options
                        }

                        $http.post('/api/polls', params)
                            .then(function successCallback(response) {
                                //redirect to poll
                                $scope.type = 'my'
                                while (optionsNode.childNodes.length > 9)
                                    optionsNode.removeChild(optionsNode.childNodes[9])
                                document.getElementById('options_form').reset()
                            })
                    }
                    else
                        $scope.options_message = 'Please fill in at least 2 options.'
                }

                var count = 2
                $scope.addOption = function() {
                    var current = count++
                        var options = document.getElementById('options')

                    //div
                    var node = document.createElement("DIV")
                    var div_class = document.createAttribute("class")
                    div_class.value = "mdl-textfield mdl-js-textfield is-upgraded"
                    node.setAttributeNode(div_class)

                    var div_upgrade = document.createAttribute("data-upgraded")
                    div_upgrade.value = ",MaterialTextfield"
                    node.setAttributeNode(div_upgrade)

                    //text
                    node.appendChild(document.createTextNode((current + 1) + "."))

                    //input
                    var input = document.createElement("INPUT")

                    var input_class = document.createAttribute("class")
                    input_class.value = "mdl-textfield__input"
                    input.setAttributeNode(input_class)

                    var input_name = document.createAttribute("name")
                    input_name.value = "option" + current
                    input.setAttributeNode(input_name)

                    var input_type = document.createAttribute("type")
                    input_type.value = "text"
                    input.setAttributeNode(input_type)

                    var input_id = document.createAttribute("id")
                    input_id.value = "option" + current
                    input.setAttributeNode(input_id)

                    //br
                    var br = document.createElement("BR")

                    node.appendChild(input)

                    options.appendChild(node)
                    options.appendChild(br)
                }

                $scope.cancelCreatePoll = function() {
                    $scope.type = 'my'
                }

                $scope.deletePoll = function() {

                }

                $scope.submit = function() {

                }

                $scope.logout = function() {
                    $http.post('/logout')
                        .then(function successCallback(response) {
                            ipCookie('pa_username', null)
                            $scope.view = 'login'
                        })
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
                        $http.post('/signup', params)
                            .then(function successCallback(response) {
                                return response
                            }, function errorCallback(response) {
                                console.log('no response from signup script')
                            })

                        .then(function(data) {
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
                                $scope.view = "home"
                                var today = new Date();
                                var expiresValue = new Date(today);
                                expiresValue.setMinutes(today.getMinutes() + 120) //2 hours

                                ipCookie('pa_username', response.data[0].username, {
                                    expires: expiresValue
                                })

                                $scope.username = ipCookie('pa_username')
                                document.getElementById('login_form').reset()
                                loadPolls()
                            }, function errorCallback(response) {
                                $scope.login_message = 'Invalid login information.'
                            })
                    }
                    else
                        $scope.login_message = 'No username and/or password.'
                }

                $scope.openPoll = function(index) {
                    window.open(window.location.href + 'poll?id=' + $scope.userPolls[index].id)
                }
            }
        ])
})();
