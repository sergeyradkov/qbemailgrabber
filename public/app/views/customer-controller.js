angular.module('QB_Project')
    .controller('CustomerController', function() {
        
        var cc = this;
        cc.updatedCustomer = {};
        
        cc.addCustomer = function(customer) {
            cc.updatedCustomer = customer;
            console.log(cc.updatedCustomer);
            cc.newCustomer = {};
        }
        
  //      cc.removePerson = function(index) {
  //          cc.list.splice(index, 1);
  //      }
        
    })