angular.module('qbhelper').service('MemberService', function ($http) {

    this.findMemberByPhone = function (mobile) {
        return $http.get('/lookup?phoneNumber=' + mobile)
    }

    this.findCustomerById = function (id) {
        return $http.get('/customer?id=' + id)
    }




})