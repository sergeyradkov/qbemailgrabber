angular.module('QB_Project')
    .controller('CustomerController', function() {
        
        var cc = this;
        
        cc.list = [];
        
        cc.addPerson = function(newPerson) {
            
            cc.list.push(newPerson)
            cc.newPerson = {};
            
        }
        
        cc.removePerson = function(index) {
            
            cc.list.splice(index, 1);
            
        }
        
    })