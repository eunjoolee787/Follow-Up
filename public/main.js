var app = angular.module("FollowUpApp", ['ui.date']);

app.controller("AccountCtrl", function ($http) {
  var app = this;
  app.people = [];
  $http.get("http://localhost:4000/form")
    .success(function (data) {
      app.people = data;
    })

    app.addPerson = function (person) {
      $http.post("http://localhost:4000/form", person)
        .success(function (data) {
          app.people = data;
          console.log(data);
        })
        .error(function (error) {
          console.log(error);
        })
    }
    app.login = function (credentials) {
      $http.post("http://localhost:4000/login", credentials)
      .success(function (login) {
        app.login = login;
        console.log(login);
      })
      .error(function (error) {
        console.log(error);
      })
    }
});


