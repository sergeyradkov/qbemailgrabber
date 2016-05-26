angular.module('QB_Project')
    .config(function ($stateProvider) {

    $stateProvider
    .state('customer', {
        url: '',
        templateUrl: 'app/views/customer.html',
        controller: 'CustomerController',
        controllerAs: 'cc'
    })

        // .state("vendor", {
        //     url: "/vendor",
        //     templateUrl: "app/views/vendor.html",
        //     controller: "VendController",
        //     controllerAs: "vend"
        // })

        // .state("items", {
        //     url: "/items",
        //     templateUrl: "app/views/items.html",
        //     controller: "itemsController",
        //     controllerAs: "items"
        // })


})