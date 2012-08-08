dnode-ez
========

Dnode-ez allows you to create events both client and server side, and fire them from either side.

Short Example
=============
    
    // server
    var server = ez();
    server.on('bind',function(name,remote,conn) {
        var myEmitter = server.getEmitter(name);
        myEmitter.emit('bar', 24);
    }); 
    server.listen(12345);

    // client
    var EE = require('events').EventEmitter;
    var ez = require('dnode-ez');
    var foo = new EE; 
    foo.on('bar', function(num) {
        var newNum = num * 2; 
        console.log(newNum); // 48
    }); 
    var client = ez();
    client.connect(12345);
    client.bind(foo,'foo');


Event Primitives
================

Dnode-ez allows for simple event handling as well, similar to Socket.io.
 
    // server
    var server = ez();
    server.listen(12345);
    server.on('connect', function(remote, conn) {
        remote.emit('systemMessage', "The Server is shutting down in 15 minutes!");
    });

    // client
    var ez = require('dnode-ez');
    var client = ez();
    client.on('systemMessage', function(msg) {
        console.log("System Message:" + msg);  // System Message: The Server is shutting down in 15 minutes!
    });
    client.connect(12345);


Bi-Directional
==============

Dnode-ez is fully bidirectional with both events being able to be bound on either side, and event primitives being able to be 
fired from either side as well. 


Tests
=====
 
to run tests, 

    tap ./test

If it complains that tap is not found, make sure tap is installed in a sibling directory next to dnode-ez or in a place node can find it.
