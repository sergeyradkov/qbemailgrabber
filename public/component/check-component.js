

angular.module('qbhelper').component('customerComponent', {
    templateUrl: '/component/check.html',
    controllerAs: 'ch',
    controller: function ($scope, $state, MemberService, PhoneService, RecaptchaService) {

        var ch = this;
        ch.phoneNumber = "";

        // formating phone number under the mask
        ch.formatPhoneNumber = function (phoneNumber, customer) {
            var formatted = PhoneService.formatPhoneNumber(phoneNumber);
            ch.phoneNumber = formatted
            if (customer) {
                ch.currentCustomer.PrimaryPhone.FreeFormNumber = formatted
            }
        }

        // TODO normolize the phone number

        // find the phone number in QB SQL
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

        function sendSMS (phone){
            MemberService.sendSMS(phone).then(CodeSuccess, handleServerError);
        }

        function handleUpdateSuccess(res) {
            console.log(" Update success");
            ch.message = "Your profile was updated successfully";
            $('#showMessage').modal('show');
        }

        function handleServerSuccess(res) {
            if (res.data) {
                ch.vform = true;
                phoneForSMS = "+1" + ch.phoneNumber.replace (/[^\d]/g, "");
                debugger
                sendSMS(phoneForSMS);
                // ch.currentCustomer = res.data;
                // ch.checked = true;
                
            } else {
                console.log(" WRONG PHONE NUMBER ");
                ch.message = "Sorry, but we do not know this phone number. Please, try again.."
                $('#showMessage').modal('show');
            }
        }

        function CodeSuccess(res) {
            console.log('CODE SENT');
        }

        function handleServerError(err) {
            console.log("SERVER ERROR ");
            ch.message = "Sorry, but there is some error. Please, try again..";
            $('#showMessage').modal('show');
        }
    }
});

