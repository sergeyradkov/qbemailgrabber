(function () {angular.module("qbhelper")
    .controller('CustomerController', function ($scope, $state, MemberService, PhoneService, recaptchaService) {
        var cc = this;
        cc.foundCustomer = {};

        MemberService.findCustomerById($state.params.id).then(function (res) {
            //auto formats phone number
            res.data.customer.phoneNumber = PhoneService.formatPhoneNumber(res.data.customer.phoneNumber)
            cc.currentCustomer = res.data.customer
        })

        this.formatPhoneNumber = function (tel) {
            cc.currentCustomer.phoneNumber = PhoneService.formatPhoneNumber(tel)
        }



    });
})();

