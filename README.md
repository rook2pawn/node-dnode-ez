dnode-ez 2013 rewritten from the ground up.
===========================================

dnode-ez has been rewritten entirely! an easier interface. 

example
=======

client.js

    var dz = require('dnode-ez');
    var ee = require('events').EventEmitter;
    var foo = new ee;
    var ez = new dz;
    ez.route(foo,'foo');
    ez.connect(5000,function() {
        foo.emit('boom',{foo:42});
    });


server.js

    var dz = require('dnode-ez')
    var ez = new dz;
    var ee = require('events').EventEmitter;
    var foo = new ee;
    foo.on('boom',function(obj) {
        console.log(obj.foo * 2); // 84
    });
    ez.route('foo',foo);
    ez.listen(5000);

.route
======

    var foo = new ee;
   
    // side A 
    ez.route(foo,'foo'); // associate ee foo events as from 'foo' to other side
   
    // side B
    ez.route('foo',foo); // associate incoming 'foo' events to ee foo 

status
======

TCP - working
Browser stream - working 
unified TCP/browser - in progress
