// test that an event made "client side" can be emitted from on the server 
// side. 
var test = require('tap').test;
var ez = require('../index');
var EE = require('events').EventEmitter;

test('testClientEvent',function(t) {
    t.plan(1);
    var clientSideEvent = new EE;
    clientSideEvent.on('newMessage',function(newmsg) {
        console.log("New messsage!!!!\n" + newmsg);
        t.equal("The system is down.", newmsg);
        t.end();
        d.closeServer();
    });
    var d = ez();
    d.on('bind', function(emitter) {
        emitter.emit('newMessage','The system is down.');
    });
    d.listen(12345);
    var c = ez();
    c.connect(12345);
    c.bind(clientSideEvent); 
});
