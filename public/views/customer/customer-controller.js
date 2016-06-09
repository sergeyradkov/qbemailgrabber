(function () {angular.module("qbhelper")
    .controller('CustomerController', function ($scope, $state, MemberService, PhoneService, recaptchaService) {
        var cc = this;
        cc.updatedCustomer = {};

        MemberService.findCustomerById($state.params.id).then(function (res) {
            //auto formats phone number
            res.data.customer.phoneNumber = PhoneService.formatPhoneNumber(res.data.customer.phoneNumber)
            cc.currentCustomer = res.data.customer
        })

        this.formatPhoneNumber = function (tel) {
            cc.currentCustomer.phoneNumber = PhoneService.formatPhoneNumber(tel)
        }


        cc.updateCustomer = function (customer) {

            cc.updatedCustomer = customer;
            
            console.log(cc.updatedCustomer);

            if (grecaptcha.getResponse()) {
                customer.captchaResponse = grecaptcha.getResponse(); //This will add the response string to the object you are sending to your server so you can make your get request server side to verify
                recaptchaService.sendForm(customer).then(function (response) {
                    window.response = response.data;
                    cc.newCustomer = {};
                });
            } else {
                $scope.error = "Please Verify you are not a robot";
            }
        }
    });
})();

(function () {
    angular.module("qbhelper").service('recaptchaService', function ($http) {
        return {
            sendForm: function (item) {
                return $http({
                    method: 'POST',
                    url: '/',
                    data: item
                });
            }
        }
    });
})();