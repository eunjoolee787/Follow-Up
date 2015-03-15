var app = angular.module("FollowUpApp", []);

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
});


var data = [
  {"firstname": "Jeff", "lastname": "Winger"},
  {"firstname": "Troy", "lastname": "Barnes"}
];

