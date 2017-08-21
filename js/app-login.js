var app = angular.module("planningApp", []);

var IPAdress = "35.165.103.236";

app.controller("loginController", function ($scope, $http, $location) {

    $scope.signin = function () {
        var status = document.getElementById("loginSucces");
        var successCallback = function (response) {
            if (response.data == "*Approved*") {
                //notifaction because redirect doesn't work
                status.innerHTML = "Login succes!";
                status.className = "alert alert-success";
                $location.path('/index.html');

            } else {
                //notifaction because redirect doesn't work
                status.innerHTML = "Login failed!"
                status.className = "alert alert-danger"
            }

        }
        var errorCallback = function (response) {
            console.log("error")
            alert.call(response);
        }
        var data = {
            "email": $scope.signinEmail,
            "password": $scope.signinPassword
        }

        $http.post('http://'+IPAdress+'/websignin', data).then(successCallback, errorCallback);


    }

});
