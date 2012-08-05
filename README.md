dnode-ez
========

DNode-ez makes [Dnode](https://github.com/substack/dnode) even easier!

Simple 
======  

    // example/simple/server.js 

    var ez = require('dnode-ez');
    var server = ez();
    server.on('connect',function() {
        server.emit('welcome','You have arrived after a long journey.');
    });
    server.listen(5000);
    
    // example/simple/client.js

    var ez = require('dnode-ez');
    var client = ez();
    client.on('welcome', function(msg) {
        console.log("Welcome!");
        console.log(msg);
    });

    client.connect(5000);


Advanced
========

