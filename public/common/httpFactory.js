app.factory('httpFactory', function ($http, $q, $rootScope) {
    return {
        post: function (api, data) {
            console.log("legoHttpFactory: data: " + JSON.stringify(data));

            var dfd = $q.defer();
            var postUrl = $rootScope.propertyJson.BASE_URL + api;
            // console.log(postUrl);
            //var postUrl=api;
            $http({
                method: 'POST',
                url: postUrl,
                data: data
            }).
                then(function (data) {
                    console.log(data);
                    dfd.resolve(data);

                }, function (error) {
                    console.log(error);
                    dfd.resolve(error);

                });

            return dfd.promise;
        },
        get: function (api) {

            var dfd = $q.defer();
            // console.log("$rootScope.propertyJson: "+JSON.stringify($rootScope.propertyJson));
            var getUrl = $rootScope.propertyJson.BASE_URL + api;
            //console.log("getUrl"+getUrl);
            //var getUrl=api;
            $http({
                method: 'GET',
                url: getUrl
            }).
                then(function (data, status, headers, config) {
                    dfd.resolve(data);

                }, function (error) {
                    console.log(error);
                    dfd.resolve(error);

                });
            /* error(function(data, status, headers, config) {
                 dfd.reject(data);
             });*/
            var j = dfd.promise.then(function (data) {
                return data;
            })

            return dfd.promise;
        },
        put: function (api, data, userName) {

            // console.log("headers"+headers);
            var dfd = $q.defer();
            var puttUrl = $rootScope.propertyJson.BASE_URL + api;
            //console.log("puttUrl"+puttUrl);
            $http({
                method: 'PUT',
                url: puttUrl,
                headers: { "Content-Type": "application/json" },
                data: data
            }).
                then(function (data) {
                    console.log(data);
                    dfd.resolve(data);

                }, function (error) {
                    console.log(error);
                    dfd.resolve(error);

                });

            return dfd.promise;
        },

        dataValidation: function (responceData) {
            //console.log("responceData status"+responceData.status);
            if (responceData.status == 200) {
                return true;
            }
            else {
                return false;
            }
        },
        csvUpload: function (obj, uploadUrl) {
            var dfd = $q.defer();
            var postUrl = $rootScope.propertyJson.BASE_URL + uploadUrl;

            var fd = new FormData();
            console.log("obj.file: " + obj.file);

            fd.append('img', obj.file);

            $http.post(postUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function (response) {
                console.log("lego--" + response)
                dfd.resolve(response);
            }, function (error) {
                console.log(error);
                dfd.resolve(error);
            });
            return dfd.promise;
        },
        imageUpload: function (uploadUrl, file) {
            var dfd = $q.defer();
            var postUrl = $rootScope.propertyJson.BASE_URL + uploadUrl;
            var fd = new FormData();
            console.log("file: " + file);
            // console.log("file: " + file.upload);

            fd.append('logo', file);
            console.log("fd: " + fd);
            $http.post(postUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function (response) {
                console.log("lego--" + response)
                dfd.resolve(response);
            }, function (error) {
                console.log(error);
                dfd.resolve(error);
            });
            return dfd.promise;
        },
        getFile: function (fileAddress) {
            console.log("getFile");
            // var dfd = $q.defer();
            $http({
                method: 'GET',
                url: fileAddress
            }).then(function (data) {
              
                $rootScope.propertyJson = data.data;
                //console.log("data: "+JSON.stringify($rootScope.propertyJson));
                return $rootScope.propertyJson;
            });
            // 
        }
    };
});
