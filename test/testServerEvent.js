// test that an event made server side can be emitted from on the client
// side. 
var test = require('tap').test;
var ez = require('../index');
var EE = require('events').EventEmitter;

test('testServerEvent',function(t) {
    t.plan(1);
    var msg = "";
    var serverEventHash = {};
    var serverSideEvent = new EE;
    serverSideEvent.on('customerHelpNeeded',function(newmsg) {
        console.log("customer help needed!!!!\n" + newmsg);
        msg = newmsg;
        t.equal(newmsg, "i can't log in");
        t.end();
        d.closeServer();
    });
    var d = ez();
    d.listen(12345);
    d.on('connect',function() {
        d.bindToClients(serverSideEvent,'serverEvents'); 
    });

    var c = ez();
    c.connect(12345);
    c.on('bind', function(name) {
        serverEventHash[name] = {};
        serverEventHash[name].emitter = c.getEmitter(name); 
        serverEventHash[name].emitter.emit('customerHelpNeeded',"i can't log in");
    });
});
