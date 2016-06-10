

angular.module('qbhelper').component('customerComponent', {
    templateUrl: '/component/check.html',
    controllerAs: 'ch',
    controller: function ($scope, $state, MemberService, PhoneService) {

        var ch = this;

        ch.formatPhoneNumber = function (phoneNumber) {
            debugger
            ch.phoneNumber = PhoneService.formatPhoneNumber(phoneNumber)
        }

        function handleServerSuccess(res) {
            if (res.data) {
                ch.checked = true;
                ch.currentCustomer = res.data;
            } else {
                console.log(" WRONG PHONE NUMBER ");
                $('#phoneWrong').modal('show');
            }
        }

        function handleServerError(err) {
                console.log("SERVER ERROR ");
                $('#serverError').modal('show');
        }

        ch.find = function (phoneNumber) {
            var normalNumber = phoneNumber;//.replace (/[^\d]/g, "");
            MemberService.findMemberByPhone(normalNumber).then(handleServerSuccess, handleServerError);
        };

        ch.updateCustomer = function (updatedCustomer) {
            ch.updatedCustomer = updatedCustomer;
            
            console.log(ch.updatedCustomer);
            debugger
            if (grecaptcha.getResponse()) {
                customer.captchaResponse = grecaptcha.getResponse(); //This will add the response string to the object you are sending to your server so you can make your get request server side to verify
                recaptchaService.sendForm(customer).then(function (response) {
                    window.response = response.data;
                    ch.currentCustomer = {};
                });
            } else {
                $scope.error = "Please Verify you are not a robot";
            }
        }

    }
});

