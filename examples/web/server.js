var ez = require('dnode-ez');
var http = require('http');
var ecstatic = require('ecstatic')(__dirname);
var server = http.createServer(ecstatic);
var d = ez();
d.listenWEB(8500,server);
d.on('connect', function() {
    console.log("A client has connected.");
    d.emit('welcome','Greetings coder!!');
});
d.on('end',function() {
    console.log("A client has disconnected.");
});
