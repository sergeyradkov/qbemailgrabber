(function () {
    angular.module("qbhelper")
        .controller('CheckController', function ($scope, $state, MemberService) {

            var ch = this;

            var $ctrl = this;
            
            this.formatPhoneNumber = function (tel) {
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

angular.module('qbhelper').service('MemberService', function ($http) {

    this.findMemberByPhone = function (mobile) {
        return $http.get('/lookup?phoneNumber=' + mobile)
    }

    this.findCustomerById = function (id) {
        return $http.get('/customer?id=' + id)
    }


    this.formatPhoneNumber = function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);
        return (country + " (" + city + ") " + number).trim();
    }

})