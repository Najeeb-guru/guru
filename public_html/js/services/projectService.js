window.app.factory('ProjectService', function($http) {

    var get_data = function(id, successcb) {
         $http.get('http://localhost/guru_backup/admin/ng_projects/index/'
                + id).success(function(data) {
            //console.log(data);
            successcb(data);
        });
    };


    return {
        get: get_data
       
    };
});