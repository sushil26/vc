careatorApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    // console.log("file from filemodel cutom drctve: " + element.files);
                    // console.log("element[0].files[0] from filemodel cutom drctve: " + element.file);
                    // console.log("element[0].files[0] from filemodel cutom drctve: " + JSON.stringify(element));
                    // console.log("element[0].files[0] from filemodel cutom drctve: " + JSON.stringify(element[0].files));
                    // console.log("element[0].files[0] from filemodel cutom drctve: " + JSON.stringify(element[0].files[0]));
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    }
}])