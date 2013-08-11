var ee = require('events').EventEmitter;
var foo = new ee;
var dz = require('../');
var server = new dz;
server.route('foo',foo);
foo.on('bar',function(msg,cb) {
    console.log("The message is  "+ msg);
    cb("All done here");
});
server.type = 'server';
server.listen(5004);
