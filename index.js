var express =require('express')
, server = express()
, port = process.env.PORT || 8080;

server.use(express.static(__dirname + '/public'));
server.listen(port, function(){
    console.log('Running.. ')
})