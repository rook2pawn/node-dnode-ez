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
    server.listen(5004);

    1. node server
    2. node client
    3. // client will connect, and fire "bar" on event foo
    4. // on server "bar" will trigger "The message is .."
    5. // and the callback will be called with "All done here"
    6. // on client that callback will be done,i.e. console.log("All done here")


node-dnode-ez Copyright (c) 2010 David Wee rook2pawn@gmail.com

Free software provided under the MIT License
http://opensource.org/licenses/mit-license.php
