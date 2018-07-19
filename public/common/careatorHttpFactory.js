careatorApp.factory('careatorHttpFactory', function ($http, $q, $rootScope) {
    return {
        post: function (api, data) {
            console.log("legoHttpFactory: data: " + JSON.stringify(data));

            var dfd = $q.defer();
            // var postUrl = $rootScope.propertyJson.BASE_URL + api;
            // console.log(postUrl);
            //var postUrl=api;
            $http({
                method: 'POST',
                url: api,
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
            console.log("get api-->");
            var dfd = $q.defer();

            $http({
                method: 'GET',
                url: api
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
        put: function (api, data) {

            // console.log("headers"+headers);
            var dfd = $q.defer();

            //console.log("puttUrl"+puttUrl);
            $http({
                method: 'PUT',
                url: api,
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

            var fd = new FormData();
            console.log("obj.file: " + obj.file);

            fd.append('img', obj.file);

            $http.post(uploadUrl, fd, {
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
        },/* #### Note:Start: Image upload into directory  #### */
        imageUpload: function (uploadUrl, file) { 
            var dfd = $q.defer();
            var postUrl = uploadUrl;
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
        },/* #### Note:End: Image upload into directory  #### */

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
