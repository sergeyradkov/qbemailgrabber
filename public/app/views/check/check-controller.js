(function() {angular.module('QB_Project')
    .controller('CheckController', function ($scope, $state) {

        var ch = this;
        ch.find = function(mobile){
            //get customer from number 
            //calls the server
            //then
            
            $state.go('update', {id: foundMember.id})
        }

    });
})();