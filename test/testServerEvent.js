// test that an event made server side can be emitted from on the client
// side. 
var test = require('tap').test;
var ez = require('../index');
var EE = require('events').EventEmitter;

test('testServerEvent',function(t) {
    t.plan(1);
    var serverSideEvent = new EE;
    serverSideEvent.on('customerHelpNeeded',function(newmsg) {
        console.log("customer help needed!!!!\n" + newmsg);
        t.equal(newmsg, "i can't log in");
        t.end();
        d.closeServer();
    });
    var d = ez();
    d.listen(12345);
    d.on('connect',function() {
        d.bindToClients(serverSideEvent); 
    });
    var c = ez();
    c.connect(12345);
    c.on('bind', function(emitter) {
        emitter.emit('customerHelpNeeded',"i can't log in");
    });
});
