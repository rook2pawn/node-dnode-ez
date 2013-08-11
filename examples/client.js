var ee = require('events').EventEmitter;
var foo = new ee;
var dz = require('../');
var client = new dz;
client.route('foo',foo);
client.type = 'client';
client.connect(5004);
client.on('connect',function(remote,conn) {
    foo.emit("bar","The quick brown fox.",function(msg) {
        console.log(msg);
    });
});
