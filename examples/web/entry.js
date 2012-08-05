var ez = require('dnode-ez');
var d = ez();
d.on('welcome',function(msg) {
    alert("Welcome! The server brings you this message: " + msg);
});
d.connectWEB();
