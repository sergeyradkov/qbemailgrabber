app.controller ("CustController", function(){
    
})

 .controller('Add Registrtation', function(){
        
        var ar = this;
        
        user.dependentlist = [];
        
        ar.addDependent = function(dependent){
            ar.dependentlist.push(dependent);
            ar.newItem = {}
        }
        
        tc.toggleItemState = function(dependent){
            if(item.completed){
                var index = tc.dependentlist.indexOf(item);
               return tc.dependentlist.splice(index, 1);
            }
            dependent.completed = true;
        }        