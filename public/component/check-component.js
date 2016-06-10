

angular.module('qbhelper').component('customerComponent', {
    templateUrl: '/component/check.html',
    controllerAs: 'ch',
    controller: function ($scope, $state, MemberService, PhoneService, RecaptchaService) {

        var ch = this;

        ch.formatPhoneNumber = function (phoneNumber) {
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

// TODO normolize the phone number
        ch.find = function (phoneNumber) { 
            var normalNumber = phoneNumber;//.replace (/[^\d]/g, "");
            MemberService.findMemberByPhone(normalNumber).then(handleServerSuccess, handleServerError);
        };

        ch.updateCustomer = function (updatedCustomer) {
            console.log(updatedCustomer);
            debugger

            if (grecaptcha.getResponse()) {
                updatedCustomer.captchaResponse = grecaptcha.getResponse(); //This will add the response string to the object you are sending to your server so you can make your get request server side to verify
                RecaptchaService.sendForm(updatedCustomer).then(function (response) {
                    window.response = response.data;
                    });
                MemberService.updateCustomer(updatedCustomer).then(handleServerSuccess, handleServerError);
                ch.currentCustomer = {};
            } else {
                $('#serverError').modal('show');
            }
        }

    }
});

