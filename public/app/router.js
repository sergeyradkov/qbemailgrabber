(function(){angular.module("qbhelper",['ui.router'])}());

angular.module("qbhelper")
    .config(function ($stateProvider) {

    $stateProvider
    .state('check', {
        url: '',
        templateUrl:'/views/check/check.html',
        controller: 'CheckController',
        controllerAs: 'ch'
    })
    .state('customer', {
        url: '/update/:id',
        templateUrl: '/views/customer/customer.html',
        controller: 'CustomerController',
        controllerAs: 'cc'
    })
})