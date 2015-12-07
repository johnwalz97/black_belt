var BlackBeltApp = angular.module('BlackBelt', ['ngRoute']);

//configure routes
BlackBeltApp.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: '/partials/dashboard.html'    
        })
        .when('/new_question', {
            templateUrl: '/partials/new_question.html'
        })
        .when('/answer/:id', {
            templateUrl: '/partials/new_answer.html'
        })
        .when('/show/:id', {
            templateUrl: '/partials/question.html'
        })
        .otherwise({redirectTo: "/"})
});

//login factory
BlackBeltApp.factory('loginFactory', function(){
    var factory = {};
    while (!factory.user || factory.user.length < 1) {
        var user = prompt("Please enter your name!");
        factory.user = user;
    }
    return factory;
})

//question factory
BlackBeltApp.factory('questionFactory', function(){
    var factory = {};
    factory.getQuestions = function(callback){
        $.get(
            "/questions",
            function (response) {
                if (response.type) {
                    callback(response.questions);
                } else {
                    alert("There was a problem retrieving the questions!");
                }
            }
        )
    }
    factory.addQuestion = function(data, callback){
        $.post(
            "/questions",
            data,
            function (response) {
                if (response.type) {
                    callback();
                } else {
                    alert("There was a problem adding your questions!");
                }
            }
        )
    }
    factory.getQuestion = function(id, callback){
        $.get(
            "/question/" + id,
            function(response){
                if (response.type) {
                    callback(response.question);
                } else {
                    alert("There was a problem adding your question!");
                }
            }
        )
    }
    factory.addAnswer = function(id, data, callback){
        $.post(
            "/add_answer/" + id,
            data,
            function(response){
                if (response.type) {
                    callback(response);
                } else {
                    alert("There was a problem adding your answer!");
                }
            }
        )
    }
    factory.updateLikes = function(id, callback){
        $.get(
            "/answer/" + id +"/like",
            function(response){
                if (response.type) {
                    callback(response.question);
                } else {
                    alert("There was a problem liking your answer!");
                }
            }
        )
    }
    return factory;
})

//dashboard controller
BlackBeltApp.controller('dashboardController', function(questionFactory, loginFactory, $scope){
    questionFactory.getQuestions(function(questions){
        $scope.questions = questions;
        $scope.$apply();
    })
})

//new question controller
BlackBeltApp.controller('newQuestionController', function(questionFactory, loginFactory, $scope, $location){
    $scope.question;
    $scope.description;
    $scope.submit = function(){
        if ($scope.question.length >= 10 && $scope.description) {
            questionFactory.addQuestion({question: $scope.question, description: $scope.description}, function(){
                alert("Your question was successfully added!");
                $scope.$apply(function(){
                    $location.path("/");
                });
            })
        }
        else if ($scope.question.length >= 10) {
            questionFactory.addQuestion({question: $scope.question}, function(){
                alert("Your question was successfully added!");
                $scope.$apply(function(){
                    $location.path("/");
                });
            })
        }
        else {
            alert("There are errors with your input!");
        }
    }
})

//show question controller
BlackBeltApp.controller('questionController', function(questionFactory, loginFactory, $scope, $routeParams){
    $scope.question
    questionFactory.getQuestion($routeParams.id, function(question){
        $scope.question = question;
        $scope.question.answers.reverse()
        $scope.$apply();
    });
    $scope.like = function(id){
        questionFactory.updateLikes(id, function(question){
            $scope.question = question;
            $scope.question.answers.reverse()
            $scope.$apply();
        });
    }
})

//new answer controller
BlackBeltApp.controller('newAnswerController', function(questionFactory, loginFactory, $scope, $routeParams, $location){
    $scope.question;
    $scope.answer;
    $scope.details;
    questionFactory.getQuestion($routeParams.id, function(question){
        $scope.question = question;
        $scope.$apply();
    });
    $scope.submit = function(){
        if ($scope.answer.length >= 5 && $scope.details) {
            questionFactory.addAnswer($routeParams.id, {answer: $scope.answer, details: $scope.details, user: loginFactory.user}, function(){
                alert("Your answer was successfully added!");
                $scope.$apply(function(){
                    $location.path("/show/"+$routeParams.id);
                });
            })
        }
        else if ($scope.answer.length >= 5) {
            questionFactory.addAnswer($routeParams.id, {answer: $scope.answer, user: loginFactory.user}, function(){
                alert("Your answer was successfully added!");
                $scope.$apply(function(){
                    $location.path("/show/"+$routeParams.id);
                });
            })
        }
        else {
            alert("There are errors with your input!");
        }
    }
})