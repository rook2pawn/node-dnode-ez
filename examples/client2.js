var dnode_ez = require('../index');
var EE = require('events').EventEmitter;
var emitter = new EE;
emitter.on('wow',function() {console.log("Wow. Just wow.");});
var client = dnode_ez();
client.connect(5050);
client.emit('foobar',' <-- nice!');
client.bind(emitter,'justAnotherEmitter');

