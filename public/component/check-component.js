

angular.module('qbhelper').component('customerComponent', {
    templateUrl: '/component/check.html',
    controllerAs: 'ch',
    controller: function ($scope, $state, MemberService, PhoneService, RecaptchaService) {

        var ch = this;

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
                    ch.currentCustomer = {};
                });
            } else {
                $('#serverError').modal('show');
            }
        }

        function sendSMS (customer){
            debugger
            MemberService.sendSMS(customer).then(CodeSuccess, handleServerError);
        }

        function showMessage (message) {
            ch.message = message;
            $('#showMessage').modal('show');
        }

        function handleUpdateSuccess(res) {
            console.log(" Update success");
            showMessage("Your profile was updated successfully");
        }

        function handleServerSuccess(res) {
            if (res.data) {
                ch.currentCustomer = res.data;
                sendSMS(ch.currentCustomer);
            } else {
                console.log(" WRONG PHONE NUMBER ");
                showMessage("Sorry, but we do not know this phone number. Please, try again..");
            }
        }

        function CodeSuccess(res) {
            console.log('CODE SENT');
            ch.vform = true;
            var code = res.data.response;
            ch.checkCode = function(vcode){
            if (code == vcode) {
                ch.checked = true;
            } else {
            console.log("WRONG SMS CODE");
            showMessage("Sorry, but it is wrong code. Please, try again..")
            }
        };
        }

        function handleServerError(err) {
            console.log("SERVER ERROR ");
            showMessage("Sorry, but there is some error. Please, try again..");
        }
    }
});

