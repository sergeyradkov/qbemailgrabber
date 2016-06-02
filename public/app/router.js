angular.module("qbhelper")
    .config(function ($stateProvider) {

    $stateProvider
    .state('check', {
        url: '',
        templateUrl:'app/views/check/check.html',
        controller: 'CheckController',
        controllerAs: 'ch'
    })
    .state('customer', {
        url: '/update/:id',
        templateUrl: 'app/views/customer/customer.html',
        controller: 'CustomerController',
        controllerAs: 'cc'
    })
})