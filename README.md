dnode-ez 2013 rewritten from the ground up.
===========================================

dnode-ez has been rewritten entirely! an easier interface. 

example
=======

client

    var ee = require('events').EventEmitter;
    var foo = new ee;
    var dz = require('dnode-ez');
    var client = new dz;
    client.route('foo',foo);
    client.type = 'client';
    client.connect(5004);
    client.on('connect',function(remote,conn) {
        foo.emit("bar","The quick brown fox.",function(msg) {
            console.log(msg);
        });
    });

server

    var ee = require('events').EventEmitter;
    var foo = new ee;
    var dz = require('dnode-ez');
    var server = new dz;
    server.route('foo',foo);
    foo.on('bar',function(msg,cb) {
        console.log("The message is  "+ msg);
        cb("All done here");
    });
    server.type = 'server';
    server.listen(5004);
