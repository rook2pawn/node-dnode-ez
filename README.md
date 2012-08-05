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

    // server.js
    var ee = require('events').EventEmitter;
    var notifications = new ee;
    server.on('bind',function(id) {
        clients[id] = {};
        clients[id] = server.getEmitter(id);
        // we can emit from clients[id].emit('whatever', args)
    }); 

    // client.js
    var ee = require('events').EventEmitter;
    var notifications = new ee;
    var client = ez();
    notifications.on('newMessage',function(msg) {
    });
    client.bind(notifications,'notifications');
