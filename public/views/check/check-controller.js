(function () {angular.module("qbhelper")
        .controller('CheckController', function ($scope, $state, MemberService, PhoneService) {

            var ch = this;
            
            ch.formatPhoneNumber = function (phoneNumber) {
                ch.phoneNumber = PhoneService.formatPhoneNumber(phoneNumber)
            }

            function handleServerSuccess(res) {
              if(res.data) {
                ch.checked = true;  
                ch.currentCustomer = res.data;
             //   $state.go('customer', { id: res.data.id })
             } else {
                 console.log(" ERROR ")
            }}

            function handleServerError(err) {

            }

            ch.find = function (phoneNumber) {
                var normalNumber = phoneNumber;//.replace (/[^\d]/g, "");
                MemberService.findMemberByPhone(normalNumber).then(handleServerSuccess, handleServerError);

            };

        });
})();
