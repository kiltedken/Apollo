(function () {
    'use strict';

    function Focus($rootScope) {
        var service = {};
        var currentFocus = "default"

        service.change = function(newFocus){
            $rootScope.$broadcast('focus', newFocus, currentFocus)
            currentFocus = newFocus
            console.log("Focus is currently: " + currentFocus);
        }

        service.get = function(){
            return currentFocus;
        }
        return service
    }

    angular.module('Apollo')
        .factory('Focus', Focus)

} (window.annyang));
