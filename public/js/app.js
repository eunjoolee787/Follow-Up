// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 
  'starter.controllers', 
  'starter.services', 
  'ngCordova', 
  'ui.router'])

.run(function($ionicPlatform, $rootScope, $state, Session) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  // $rootScope.$on( '$stateChangeStart', function(e, toState  , toParams
  //                                                  , fromState, fromParams) {
  //       // console.log(toState);
  //       var isLogin = Session.loggedIn;
  //       if(isLogin){
  //          return; // no need to redirect 
  //       }

  //       // now, redirect only not authenticated

  //       // var userInfo = authenticationSvc.getUserInfo();

  //       if(isLogin === false && toState.name != "login") {
  //           e.preventDefault(); // stop current execution
  //           $state.go('login'); // go to login
  //       }
  //   });
})



angular.module("starter").config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // .state('login', {
  //   url: '/login',
  //   templateUrl: 'templates/login.html',
  //   controller: 'LoginCtrl'
  // })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: "SessionCtrl as session"
  })

//TAB-ADD.HTML
  .state('tab.add', {
    url: '/add',
    views: {
      'tab-add': {
        templateUrl: 'templates/tab-add.html',
        controller: 'DashCtrl as app'
      }
    }
  })

  .state('tab.lists', {
      url: '/lists',
      cache: false,
      views: {
        'tab-lists': {
          templateUrl: 'templates/tab-lists.html',
          controller: 'ProspectsCtrl as app'
        }
      }
    })

    .state('tab.lists-detail', {
      url: '/lists/:prospectId',
      cache: false,
      views: {
        'tab-lists': {
          templateUrl: 'templates/lists-detail.html',
          controller: 'ProspectsDetailCtrl as app'
        }
      }
    })

    .state('tab.lists-edit', {
      url: '/lists/:prospectId/edit',
      cache: false,
      views: {
        'tab-lists': {
          templateUrl: 'templates/lists-edit.html',
          controller: 'ProspectsEditCtrl as app'
        }
      }
    })

    .state('tab.lists-type', {
      url: '/lists/:prospectId/type',
      views: {
        'tab-lists': {
          templateUrl: 'templates/lists-type.html',
          controller: 'ProspectsTypeCtrl as app'
        }
      }
    })

    .state('tab.lists-decision', {
      url: '/lists/:prospectId/decision',
      views: {
        'tab-lists': {
          templateUrl: 'templates/lists-decision.html',
          controller: 'ProspectsDecisionCtrl as app'
        }
      }
    })
  .state('tab.export', {
    url: '/export',
    views: {
      'tab-export': {
        templateUrl: 'templates/tab-export.html',
        controller: 'AccountCtrl as app'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/add'); // /tab/dash

});