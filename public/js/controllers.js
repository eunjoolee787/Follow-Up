angular.module('starter.controllers', [])

//LOGIN
.controller('LoginCtrl', function($scope, $ionicPopup, $state, $http) {
    $scope.data = {};
 
    $scope.login = function() {
      $http.post("/validateUser", {username: $scope.data.username, password: $scope.data.password})
        .success(function(data) {
          if(data.success)
            $state.go('tab.add');
          else {
            var alertPopup = $ionicPopup.alert({
              title: 'Login failed!',
              template: 'Please check your credentials!'
            });
          }
        })
        .error(function (error) {
          console.log(error);
        });
    }
})


//ADD
.controller('DashCtrl', function($http, $scope) {
  var app = this;
  app.people = [];

    app.addPerson = function (person) {
      console.log(person);
      $http.post("/form", person)
        .success(function (data) {
          app.people = data;
          console.log(data);
        })
        .error(function (error) {
          console.log(error);
        })
    }
    app.toggle = function () {
      console.log("toggle");
    }

})


.controller('ProspectsCtrl', function($scope, Prospects) {
  
  $scope.prospects = [];
  console.log("tony");
  Prospects.all()
  .success(function (data) {
    console.log(data);
    $scope.prospects = data;
    return data;
  })
  .error(function (error) {
    console.log(error);
  });

})


.controller('ProspectsDetailCtrl', function($scope, $stateParams, Prospects, $ionicPopup) {
  $scope.prospect = {};
  Prospects.get($stateParams.prospectId)
  .then(function (response) {
    $scope.prospect = response.data;
  })

   // A confirm dialog
   $scope.showConfirm = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Delete',
       template: 'Are you sure you want to delete this contact?'
     });
     confirmPopup.then(function(res) {
       if(res) {
         Prospects.delete($stateParams.prospectId)
       } else {
         console.log('You are not sure');
       }
     });
   };

})




.controller('ProspectsEditCtrl', function($scope, $stateParams, Prospects, $http) {
 var app = this;

  $scope.prospect = {};
  Prospects.get($stateParams.prospectId)
  .then(function (response) {
    $scope.prospect = response.data;
    $scope.prospect.modifieddate = new Date();
    console.log(response.data);
  })

  app.editPerson = function (person) {
      $http.put("/prospects/"+$stateParams.prospectId, person)
        .success(function (data) {
          app.person = data;
          console.log(data);
        })
        .error(function (error) {
          console.log(error);
        })
    }

    app.toggle = function () {
    console.log("toggle");
  }
  // $scope.today = new Date();
})

.controller('ProspectsTypeCtrl', function($scope, $stateParams, Prospects, $http) {
  var app = this;

  $scope.prospect = {};
  Prospects.get($stateParams.prospectId)
  .then(function (response) {
    $scope.prospect = response.data;
    $scope.prospect.modifieddateType = new Date();
    console.log(response.data);
  })

  app.editPerson = function (person) {
      $http.put("/prospects/"+$stateParams.prospectId, person)
        .success(function (data) {
          // app.people = data;
          app.person = data;
          console.log(data);
        })
        .error(function (error) {
          console.log(error);
        })
    }

    app.toggle = function () {
    console.log("toggle");
  }
    // $scope.today = new Date();
})

.controller('ProspectsDecisionCtrl', function($scope, $stateParams, Prospects, $http) {
  var app = this;

  $scope.prospect = {};
  Prospects.get($stateParams.prospectId)
  .then(function (response) {
    $scope.prospect = response.data;
    $scope.prospect.modifieddateDecision = new Date();
    console.log(response.data);
  })

  app.editPerson = function (person) {
      $http.put("/prospects/"+$stateParams.prospectId, person)
        .success(function (data) {
          // app.people = data;
          app.person = data;
          console.log(data);
        })
        .error(function (error) {
          console.log(error);
        })
    }

    app.toggle = function () {
    console.log("toggle");
  }
    $scope.today = new Date();
})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});