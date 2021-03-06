angular.module('starter.controllers', [])

//LOGIN
.controller('LoginCtrl', function($scope, Session, $state, $ionicPopup) {
  $scope.data = {};
  $scope.login = Session.login;
  $scope.login = function() {
    Session.login ({username: $scope.data.username, password: $scope.data.password}) 
    .success(function(data) {
        if(data.success) {
          console.log(Session.loggedIn);
          Session.loggedIn = true;
          $state.go('tab.add');
          console.log(Session.loggedIn);
        }
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

.controller('SessionCtrl', function($scope) {
  console.log("session");
  loggedIn: false,
  $scope.data = {};
})

.directive('focusOn', function() {
   return function(scope, elem, attr) {
      scope.$on(attr.focusOn, function(e) {
          elem[0].focus();
      });
   };
})

//ADD
.controller('DashCtrl', function($http, $scope, $ionicPopup, Prospects, $ionicScrollDelegate) {
  var app = this;
  app.people = [];
  // $scope.prospect = {};
  // Prospects.get($stateParams.prospectId)
  // .then(function (response) {
  //   $scope.prospect = response.data;
  // })

    app.addPerson = function (person) {
      console.log(person);
      $http.post("/form", person)
        .success(function (data) {
          app.people = data;
          console.log(data);
          app.person = {};//clear out person whenever log out
        })
        .error(function (error) {
          console.log(error);
        })
    }
    app.toggle = function () {
      console.log("toggle");
    }
  //   $scope.scrollToKey = function (anchorName) {
  //   $location.hash(anchorName);
  //   $ionicScrollDelegate.$getByHandle('containerScroll').anchorScroll();
  // };
  // $scope.isRequired = false;
})

   // // // A save dialog
   // $scope.showConfirm = function() {
   //   var confirmPopup = $ionicPopup.confirm({
   //     title: 'Save',
   //     template: 'Are you sure you want to save this contact?'
   //   });
   //   confirmPopup.then(function(res) {
   //    console.log(res);
   //     if(res) {
   //       Prospects.save($stateParams.prospectId)
   //     } else {
   //       console.log('You are not sure?');
   //     }
   //   });
   // };

// $scope.saveConfirm = function(prospectId) {
//   var confirmPopup = $ionicPopup.confirm({
//     title: "Save Record",
//     template: "Are you sure you want to save this contact?"
//   });
//   confirmPopup.then(function(res) {
//     if(res) {
//       $http.get("/prospects/"+prospectId+"", person)
//         .success(function (data) {
//           if(data) {//if contact is saved successfully, let user know
//             $http.post('/saveMail', {
//               saveContents: data
//             })
//             .success(function(isContactSave) {
//               if(isContactSave) {
//                 $ionicPopup.alert({
//                   title: "Success Saving Contact",
//                   template: "You have successfully saved a contact."
//                 })
//                 .then(function(res2) {
//                   console.log("Success saving contact");
//                 });
//               } else {
//                 $ionicPopup.alert({
//                   title: "Failure to save contact",
//                   template: "Something went wrong when saving the contact. Please try again."
//                 })
//                 .then(function(res3) {
//                   console.log("Failed to save contact");
//                 })
//               }
//             })
//             .error(function (err) {
//               console.log(err);
//             });
//           } else {//if save is not successful, alert the user
//             $ionicPopup.alert({
//               title: "Contact Was Not Saved",
//               template: "Something went wrong when saving the contact, so the contact was not saved.  Please try again."
//             })
//             .then(function(res4) {
//               console.log("Failed to save contact");
//             });
//           }
//         })
//         .error(function (error) {
//           console.log(error);
//         });
//       }
//     });
//   };


//PROSPECTS
.controller('ProspectsCtrl', function($scope, Prospects) {
  
  $scope.prospects = [];
  Prospects.all()
  .success(function (data) {
    // console.log(data);
    $scope.prospects = data;
    return data;
  })
  .error(function (error) {
    console.log(error);
  });
})

//PROSPECTS DETAIL
.controller('ProspectsDetailCtrl', function($scope, $stateParams, Prospects, $ionicPopup, $cordovaEmailComposer, $http) {
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
      console.log(res);
       if(res) {
         Prospects.delete($stateParams.prospectId)
       } else {
         console.log('You are not sure');
       }
     });
   };

  // Save Export CSV File
  $scope.exportRecord = function(prospectId) {
    $http.get("/prospects/"+prospectId+"/export")
      .success(function (data) {
        console.log(data);
      })
    .error(function (error) {
      console.log(error);
    });
  };

  $scope.emailRecord = function(prospectId, recipientEmail) {
    // console.log(recipientEmail);
    if(!recipientEmail) {
      $ionicPopup.alert({
        title: "Provide Recipient Email",
        template: "You must provide the recipient email in order to email a CSV."
      })
      .then(function(res5) {
        console.log("Recipient Email Address Is Not Provided.");
      });
      return false;
    }

    var confirmPopup = $ionicPopup.confirm({
      title: 'Email Record',
      template: 'Are you sure you want to email this contact?'
    });
    confirmPopup.then(function(res) {
      if(res) {
        $http.get("/prospects/"+prospectId+"/export")
          .success(function (data) {
            if(data) { //if export is a success, send an email
              $http.post('/sendMail', {
                csvContents: data,
                recipient: recipientEmail
              })
                .success(function(isEmailSent) { 
                  if(isEmailSent.success) {
                    $ionicPopup.alert({
                      title: "Success Sending Email",
                      template: "You have successfully sent an email containing the CSV file."
                    })
                    .then(function(res2) {
                      console.log("Success sending email");
                    });
                  }
                  else {
                    $ionicPopup.alert({
                      title: "Failure Sending Email",
                      template: "Something went wrong when sending the email. Please try again."
                    })
                    .then(function(res3) {
                      console.log("Failed to send email");
                    });
                  }
                })
                .error(function (err) {
                  console.log(err);
                });
            }
            else {//if export is not successful, alert the user
              $ionicPopup.alert({
                title: "Email Was Not Sent",
                template: "Something went wrong when exporting the CSV file, so an email was not sent. Please try again."
              })
              .then(function(res4) {
                console.log("Failed to export CSV for email");
              });
            }
          })
          .error(function (error) {
            console.log(error);
          });
        }
      });  
    };

  })

//PROSPECTS EDIT
.controller('ProspectsEditCtrl', function($scope, $stateParams, Prospects, $http, $ionicHistory) {
 var app = this;

  $scope.prospect = {};
  Prospects.get($stateParams.prospectId)
  .then(function (response) {
    $scope.prospect = response.data;
    if ($scope.prospect.previouslysaved === "true"){
     $scope.prospect.previouslysaved = true;
     } else {
      $scope.prospect.previouslysaved = false;
     }
      if ($scope.prospect.previouslybaptized === "true"){
       $scope.prospect.previouslybaptized = true;
     } else {
      $scope.prospect.previouslybaptized = false;
     }
    $scope.prospect.modifieddate = new Date();
    console.log(response.data);
  })

  app.editPerson = function (person) {
    $http.put("/prospects/"+$stateParams.prospectId, person)
      .success(function (data) {
        app.person = data;
        console.log(data);
        $ionicHistory.goBack();
      })
      .error(function (error) {
        console.log(error);
      })
    }
    app.toggle = function () {
    console.log("toggle");
    }
})

//PROSPECTS TYPE
.controller('ProspectsTypeCtrl', function($scope, $stateParams, Prospects, $http, $ionicHistory) {
  var app = this;

  $scope.prospect = {};
  Prospects.get($stateParams.prospectId)
  .then(function (response) {
    $scope.prospect = response.data;
  if ($scope.prospect.visit === "true"){
     $scope.prospect.visit = true;
   } else {
    $scope.prospect.visit = false;
   }
   if ($scope.prospect.letter === "true"){
     $scope.prospect.letter = true;
   } else {
    $scope.prospect.letter = false;
   }
   if ($scope.prospect.visitchurch === "true"){
     $scope.prospect.visitchurch = true;
   } else {
    $scope.prospect.visitchurch = false;
   }
   if ($scope.prospect.phonecall === "true"){
     $scope.prospect.phonecall = true;
   } else {
    $scope.prospect.phonecall = false;
   }
   if ($scope.prospect.emailed === "true"){
     $scope.prospect.emailed = true;
   } else {
    $scope.prospect.emailed = false;
   }
    $scope.prospect.modifieddateType = new Date();
    console.log($scope.prospect);
  })

  app.editPerson = function (person) {
  $http.put("/prospects/"+$stateParams.prospectId, person)
    .success(function (data) {
      app.person = data;
      console.log(data);
    $ionicHistory.goBack();
    })
    .error(function (error) {
      console.log(error);
    })
  }
  app.toggle = function () {
  console.log("toggle");
  }
})

//PROSPECTS DECISION
.controller('ProspectsDecisionCtrl', function($scope, $stateParams, Prospects, $http, $ionicHistory) {
  var app = this;

  $scope.prospect = {};
  Prospects.get($stateParams.prospectId)
  .then(function (response) {
    $scope.prospect = response.data;
    if ($scope.prospect.saved === "true"){
     $scope.prospect.saved = true;
     } else {
      $scope.prospect.saved = false;
     }
    if ($scope.prospect.baptized === "true"){
     $scope.prospect.baptized = true;
     } else {
      $scope.prospect.baptized = false;
     }
     if ($scope.prospect.joinedthechurch === "true"){
     $scope.prospect.joinedthechurch = true;
     } else {
      $scope.prospect.joinedthechurch = false;
     }
    $scope.prospect.modifieddateDecision = new Date();
    console.log(response.data);
  })

  app.editPerson = function (person) {
    $http.put("/prospects/"+$stateParams.prospectId, person)
      .success(function (data) { 
        app.person = data;
        console.log(data);
        $ionicHistory.goBack();
      })
      .error(function (error) {
        console.log(error);
      })
    }
    app.toggle = function () {
    console.log("toggle");
    }
  })


// //FRIENDS
// .controller('AccountCtrl', function($scope) {
//   $scope.settings = {
//     enableFriends: true
//   };
// });