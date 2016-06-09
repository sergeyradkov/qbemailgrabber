(function () {angular.module("qbhelper")
        .controller('CheckController', function ($scope, $state, MemberService, PhoneService) {

            var ch = this;
            
            ch.formatPhoneNumber = function (phoneNumber) {
                ch.phoneNumber = PhoneService.formatPhoneNumber(phoneNumber)
            }

            function handleServerSuccess(res) {
                $state.go('customer', { id: res.data.member.id })
            }

            function handleServerError(err) {

            }

            ch.find = function (phoneNumber) {
                MemberService.findMemberByPhone(phoneNumber).then(handleServerSuccess, handleServerError)
                debugger
                //get customer from number 
                //calls the server
                //then
            }

        });
})();
