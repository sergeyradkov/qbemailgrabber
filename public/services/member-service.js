angular.module('qbhelper').service('MemberService', function ($http) {

    this.findMemberByPhone = function (phoneNumber) {
        
        return $http.get('/lookup?phoneNumber=' + phoneNumber)
    }

    this.findCustomerById = function (id) {
        return $http.get('/customer?id=' + id)
    }




})