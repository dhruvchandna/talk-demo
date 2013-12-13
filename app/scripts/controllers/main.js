'use strict';

angular.module('sampleTrial2App')
  .controller('MainCtrl', function ($scope,$http) {
      $http.get('/api/comments').
        success(function (data){
            $scope.comments = data;
        });

      $scope.addComment = function(comment){
        $http.post('/api/comments',{content: comment})
          .success(function(){
      $http.get('/api/comments').
        success(function (data){
            $scope.comments = data;
        });            
          });  
      };

  });
