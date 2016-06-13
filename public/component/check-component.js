

angular.module('qbhelper').component('customerComponent', {
    templateUrl: '/component/check.html',
    controllerAs: 'ch',
    controller: function ($scope, $state, MemberService, PhoneService, RecaptchaService) {

        var ch = this;
        ch.phoneNumber = "";

        ch.formatPhoneNumber = function (phoneNumber) {
            ch.phoneNumber = PhoneService.formatPhoneNumber(phoneNumber)
        }

        function handleUpdateSuccess(res){
            console.log(" Update success");
            ch.message = res.data.message;
            $('#showMessage').modal('show');
            // $scope.$evalAsync()
        }

        function handleServerSuccess(res) {
            if (res.data) {
                ch.checked = true;
                ch.currentCustomer = res.data;
            } else {
                console.log(" WRONG PHONE NUMBER ");
                ch.message = "Sorry, but we do not know this phone number. Please, try again.."
                $('#showMessage').modal('show');
            }
        }

        function handleServerError(err) {
                console.log("SERVER ERROR ");
                ch.message = "Sorry, but there is some error. Please, try again.."
                $('#showMessage').modal('show');
        }

// TODO normolize the phone number
        ch.find = function (phoneNumber) { 
            var normalNumber = phoneNumber;//.replace (/[^\d]/g, "");
            MemberService.findMemberByPhone(normalNumber).then(handleServerSuccess, handleServerError);
        };

        ch.updateCustomer = function (updatedCustomer) {
            if (grecaptcha.getResponse()) {
                updatedCustomer.captchaResponse = grecaptcha.getResponse();
                RecaptchaService.sendForm().then(function (response) {
                    window.response = response.data;
                    MemberService.updateCustomer(updatedCustomer).then(handleUpdateSuccess, handleServerError);
                    debugger
                    ch.currentCustomer = {};
                    });
            } else {
                $('#serverError').modal('show');
            }
        }

    }
});

