// test that a primitive event can be emitted from the server 
// side. a primitive event is one where there is no actual event emitter
// but merely saying client.on('foo', fn) and server.emit('foo')
var test = require('tap').test;
var ez = require('../index');
test('testClientPrimitiveEvent',function(t) {
    t.plan(1);
    var d = ez();
    d.listen(12345);
    d.on('connect',function(remote,conn) {
        remote.emit('welcome', "Hi there, traveller!");    
        console.log("Server got a connection.");
        console.log(remote);
    });

    var msg = "";
    var c = ez();
    c.connect(12345);
    c.on('welcome',function(msg) {
        console.log("System message:\n"+msg); 
        t.equal(msg,"Hi there, traveller!");
        t.end();
        d.closeServer();
    });

});
