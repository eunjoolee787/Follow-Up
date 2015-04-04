angular.module('starter.services', [])

.factory('Session', function($http) {
  console.log('Session');
  return {
    loggedIn: false,
    login: function(credentials){
      return $http.post("http://localhost:8000/validateUser", credentials);
    }
  };

})
.factory('Prospects', function($http) {

  return {
    all: function() {
      return $http.get("http://localhost:8000/prospects");

    },
    remove: function(prospect) {
      prospects.splice(prospects.indexOf(prospect), 1);
    },
    get: function(prospectId) {
      return $http.get("http://localhost:8000/prospects/"+prospectId);
    },
    delete: function(prospectId) {
      return $http.delete("http://localhost:8000/prospects/"+prospectId);
    }
  };
});