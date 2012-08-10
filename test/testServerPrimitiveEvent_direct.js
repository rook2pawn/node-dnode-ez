// test that a primitive event can be emitted from the client 
// side. a primitive event is one where there is no actual event emitter
// but merely saying server.on('foo', fn) and client.emit('foo')
var test = require('tap').test;
var ez = require('../index');

test('testServerPrimitiveEvent_direct', function(t) {
    t.plan(1);
    var d = ez();
    d.listen(12345);
    d.on('newClient',function(msg) {
        console.log("new client says:\n");
        console.log(msg);
        t.equal(msg, 'My name is Foo Bar');
        t.end();
        d.closeServer();
    });
    var c = ez();
    c.connect(12345);
    c.on('connect',function(remote,conn) {
        //remote.emit('newClient','My name is Foo Bar');
        c.emit('newClient','My name is Foo Bar');
    });
});
