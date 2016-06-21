(function(){
    angular.module("qbhelper",['ui.router', 'js-data']);
    angular.module("qbhelper")
        .run(function(DS, DSHttpAdapter) {
        DS.registerAdapter('http', DSHttpAdapter, { default: true });
        })
}());