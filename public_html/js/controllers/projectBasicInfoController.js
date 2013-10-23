window.app.controller('basicInfoController', [ '$scope', 'ProjectService' , function($scope, ProjectService) {
    console.log('controller');
   ProjectService.get(21, function(data){
        console.log(data);
   });
}]);