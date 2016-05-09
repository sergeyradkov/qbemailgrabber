app.config(function ($stateProvider) {

    $stateProvider.state("customer", {
        url: "/customer",
        templateUrl: "app/views/customer.html",
        controller: "CustController",
        controllerAs: "cust"
    })

        .state("vendor", {
            url: "/vendor",
            templateUrl: "app/views/vendor.html",
            controller: "VendController",
            controllerAs: "vend"
        })

        .state("items", {
            url: "/items",
            templateUrl: "app/views/items.html",
            controller: "itemsController",
            controllerAs: "items"
        })


})