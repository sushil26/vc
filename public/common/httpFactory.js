app.factory('httpFactory', function($http, $q, $rootScope) {
    return {
        post: function(api,data) {
            console.log("legoHttpFactory: data: "+JSON.stringify(data));
             
            var dfd = $q.defer();
            // var postUrl = $rootScope.propertyJson.BASE_URL+api;
           // console.log(postUrl);
            //var postUrl=api;
            $http({
                method: 'POST',
                url: api,
                data: data
            }).
            then(function(data) {
                console.log(data);
                dfd.resolve(data);
               
            },function(error){
                console.log(error);
                dfd.resolve(error);
               
            });
            
            return dfd.promise;
        },
        get: function(api) {
            
            var dfd = $q.defer();
            var getUrl = $rootScope.propertyJson.BASE_URL+api;
            //console.log("getUrl"+getUrl);
            //var getUrl=api;
            $http({
                method: 'GET',
                url: getUrl
            }).
            then(function(data, status, headers, config) {
                dfd.resolve(data);
                
            },function(error){
                console.log(error);
                dfd.resolve(error);
                 
            });
           /* error(function(data, status, headers, config) {
                dfd.reject(data);
            });*/
            var j = dfd.promise.then(function(data) {
                return data;
            })
             spinnerService.hide('spinner');
            return dfd.promise;
        },
        put:function(api,data,userName){
            
           // console.log("headers"+headers);
            var dfd = $q.defer();
            // var puttUrl = $rootScope.propertyJson.BASE_URL+api;
            //console.log("puttUrl"+puttUrl);
            $http({
            method: 'PUT',
            url: puttUrl,
            headers: {"Content-Type": "application/json"},
            data: data
        }).
            then(function(data) {
                console.log(data);
                dfd.resolve(data);
               
            },function(error){
                console.log(error);
                dfd.resolve(error);
              
            });
            
            return dfd.promise;
        },
       
        dataValidation: function(responceData) {
            //console.log("responceData status"+responceData.status);
            if (responceData.status == 200) {
                return true;
            }  
            else {
                return false;
            }
        },
        getFile: function(fileAddress) {
           // var dfd = $q.defer();
            $http({
                method: 'GET',
                url: fileAddress
            }).then(function(data) {
                //    $rootScope.propertyJson = data.data;
                //      return $rootScope.propertyJson;
            });
          // 
        }
    };
});
