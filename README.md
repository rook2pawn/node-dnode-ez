dnode-ez
========

[Dnode-EZ](https://github.com/rook2pawn/node-dnode-ez) allows you to create events both client and server side, and fire them from either side.
This module transforms and inverts control of [Dnode](https://github.com/substack/dnode).

Short Example
=============
    
    // server
    var server = ez();
    server.on('bind',function(emitter) {
        emitter.emit('bar', 24);
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
    client.bind(foo);


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

You can also do direct emits on the client/server object itself.

    client.emit('foo', 42);
    
    // or

    server.emit('msg', 'the system is shutting down');


Bi-Directional
==============

Dnode-ez is fully bidirectional with both events being able to be bound on either side, and event primitives being able to be 
fired from either side as well. 

Web Too
=======

Dnode-ez supports web browsers in the same fashion.
Use 

    server.listenWEB(12345);
    // instead of
    server.listen(12345);

and 

    client.connectWEB();
    // instead of 
    client.connect(12345);

Also for the web code, put your code into some file, say, entry.js, and run

    browserify entry.js -o bundle.js

Summary
=======

(1) You can create an event

    var ee = require('events').EventEmitter;
    var foo = new ee;
    foo.on('hello', function(msg) { alert("system hello:" + msg); });
   
And bind/attach this event to either side and that side can than emit onto that event
    
    // on the client 
    client.bind(foo,'foo');

    // on the server
    var foo = undefined;
    server.on('bind', function(name, remote, conn, emitter) {
        foo = emitter;
    }); 
    // some time later
    foo.emit('hello', 'Welcome!');

    // results in
    // system hello: Welcome!

(2) You can directly emit to the client/server i.e.

    client.emit('bar', arg1, ...)
    
    server.emit('foo', arg1, ...)

Whereupon the server.emit will emit to all connected clients, and client.on('foo', fn) will respond in kind;
the client.emit will emit to the attached server, and the server.on('bar', fn) will respond in kind.


Tests
=====
 
to run tests, 

    tap ./test

If it complains that tap is not found, make sure tap is installed in a sibling directory next to dnode-ez or in a place node can find it.


TODO
====

UtilEmitter.on('end') for cleanup steps on clients[conn.id] object
Tests for the disconnect cleanup steps

