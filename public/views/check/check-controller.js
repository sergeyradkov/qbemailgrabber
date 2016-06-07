(function () {
    angular.module("qbhelper")
        .controller('CheckController', function ($scope, $state, MemberService) {

            var ch = this;
            var $ctrl = this;
            
            this.formatPhoneNumber = function (tel) {
                debugger
                $ctrl.phoneNumber = MemberService.formatPhoneNumber(tel)
            }

            function handleServerSuccess(res) {
                $state.go('customer', { id: res.data.member.id })
            }

            function handleServerError(err) {

            }

            ch.find = function (mobile) {

                MemberService.findMemberByPhone(mobile).then(handleServerSuccess, handleServerError)
                //get customer from number 
                //calls the server
                //then

            }

        });
})();
