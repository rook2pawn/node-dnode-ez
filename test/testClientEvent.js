// test that an event made "client side" can be emitted from on the server 
// side. 
var test = require('tap').test;
var ez = require('../index');
var EE = require('events').EventEmitter;

test('testClientEvent',function(t) {
    t.plan(1);
    var msg = "";
    var clientEventHash = {};
    var clientSideEvent = new EE;
    clientSideEvent.on('newMessage',function(newmsg) {
        console.log("New messsage!!!!\n" + newmsg);
        msg = newmsg;
        t.equal("The system is down.", newmsg);
        t.end();
        d.close();
    });
    var allDone = new EE;
    allDone.on('done',function() {
    });
    
    var d = ez();
    d.on('bind', function(name,remote,conn) {
        clientEventHash[conn.id] = {};
        clientEventHash[conn.id].emitter = d.getEmitter(name); 
        clientEventHash[conn.id].emitter.emit('newMessage','The system is down.');
    });
    d.listen(12345);
    var c = ez();
    c.connect(12345);
    c.bind(clientSideEvent,'ce'); 
});
