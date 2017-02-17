'use strict';

(function() {
    angular.module('poll', ['ngResource', 'ipCookie'])
        .controller('pollCtrl', ['$scope', '$http', 'ipCookie',
            function($scope, $http, ipCookie) {

                function fillChart(data) {
                    var node = document.getElementById("canvas_area")
                    while (node.firstChild) {
                        node.removeChild(node.firstChild)
                    }

                    var ctx = document.createElement("CANVAS")
                    var ctx_id = document.createAttribute("id")
                    ctx_id.value = 'myChart'
                    var ctx_width = document.createAttribute("width")
                    ctx_width.value = '400'
                    var ctx_height = document.createAttribute("height")
                    ctx_height.value = '400'
                    ctx.setAttributeNode(ctx_height)
                    ctx.setAttributeNode(ctx_width)
                    ctx.setAttributeNode(ctx_id)
                    node.appendChild(ctx)

                    var chart_label = []
                    var chart_votes = []
                    var chart_bg = []
                    var chart_border = []
                    data.options.forEach(function(option) {
                        chart_label.push(option.content)
                        chart_votes.push(option.votes)
                        chart_bg.push('rgba(54, 162, 235,  1)')
                        chart_border.push('rgba(54, 162, 235, 1)')
                    })

                    var myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: chart_label,
                            datasets: [{
                                label: '# of Votes',
                                data: chart_votes,
                                backgroundColor: chart_bg,
                                borderColor: chart_border,
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        stepSize: 1
                                    }
                                }]
                            }
                        }
                    });
                }

                $scope.options = []
                $scope.title = ''
                $scope.error_message = ''
                var pollData = {}

                var str = window.location.href
                var str = str.split('?')
                if (str.length > 1) {
                    var params = str[1]
                    var id = params.split('=')[1]


                    if (params) {

                        if (id && params.split('=')[0] == 'poll_id') {
                            var info = {
                                type: 'poll',
                                poll_id: id
                            }

                            var test = $http.post('/api/polls', info)
                                .then(function successCallback(response) {
                                    $scope.error_message = ''
                                    $scope.title = response.data.title
                                    $scope.options = response.data.options
                                    pollData = response.data
                                    fillChart(response.data)
                                }, function errorCallback(response) {
                                    $scope.error_message = 'Poll does not exist.'
                                })
                        }
                    }
                }
                else {
                    $scope.error_message = 'Poll does not exist.'
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
                        type: "update",
                        index: count,
                        id: id,
                        pollData: pollData
                    }

                    fillChart(pollData)

                    $http.post('/api/polls', data)
                        .then(function successCallback(response) {
                            document.getElementById('submit_button').disabled = true
                        })
                }
                var addOptionCount = 0
                $scope.addOption = function() {
                    var node = document.getElementById('poll_form')

                    var div = document.createElement("DIV")
                    var div_class = document.createAttribute("class")
                    div_class.value = "gl-option"
                    div.setAttributeNode(div_class)

                    var label = document.createElement("LABEL")
                    var label_class = document.createAttribute("class")
                    label_class.value = "mdl-radio mdl-js-radio mdl-js-ripple-effect"
                    label.setAttributeNode(label_class)

                    var text = document.createElement("INPUT")
                    var text_type = document.createAttribute("type")
                    var text_id = document.createAttribute("id")
                    text_type.value = "text"
                    text_id.value = "new_option_input"
                    text.setAttributeNode(text_type)
                    text.setAttributeNode(text_id)

                    text.addEventListener('keyup', function(e) {
                        if (e.keyCode == 13) {
                            insertOptions()
                        }
                    })

                    label.appendChild(text)
                    div.appendChild(label)
                    node.appendChild(div)
                }

                var insertOptions = function() {
                    var new_content = document.getElementById('new_option_input').value
                    var new_option = {
                        content: new_content,
                        votes: 0
                    }
                    pollData.options.push(new_option)
                    console.log(pollData.options)

                    $scope.options = pollData.options

                    var node = document.getElementById('poll_form')
                    var lastChild = node.lastChild
                    node.removeChild(lastChild)

                    if (new_content) {
                        fillChart(pollData)
                        var newPollContent = {
                            type: 'update',
                            pollData: pollData,
                            id: id
                        }
                        $http.post('/api/polls', newPollContent)
                            .then(function(data) {
                                console.log('option inserted')
                            })
                    }
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
