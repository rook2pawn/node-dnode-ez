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
    var clientEvent;
    server.on('bind',function(id) {
        clientEvent = server.getEmitter(id);
        // we can now emit from clientEvent
        // i.e clientEvent.emit('newMessage','you have mail!');
    }); 

    // client.js
    var ee = require('events').EventEmitter;
    var notifications = new ee;
    var client = ez();
    notifications.on('newMessage',function(msg) {
    });
    client.bind(notifications,'notifications');

Browser
=======

To run it in the browser, simply take this

    // client.js
    var ez = require('dnode-ez');
    var d = ez();
    d.on('welcome',function(msg) {
        alert("Welcome! The server brings you this message: " + msg);
    });
    d.connectWEB();

and run "browserify client.js -o bundle.js" to compile the browser side js. To install browserify, simply npm install -g browserify (-g for global)

Then we can run a server like this

    // server.js
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

Tests
=====
 
to run tests, 

    tap ./test

If it complains that tap is not found, make sure tap is installed in a sibling directory next to dnode-ez or in a place node can find it.
