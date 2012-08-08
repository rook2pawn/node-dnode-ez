// test that both client and server will respond to custom connect events

var test = require('tap').test;
var ez = require('../index');
var EE = require('events').EventEmitter;

test('connectEvents',function(t) {
    t.plan(1);
    var d = ez();
    var num = 3;
    var allDone = new EE;
    allDone.on('done',function() {
        t.equal(1, num);
        d.close();
        t.end();
    });
    d.on('connect',function(remote,conn) {
        d.closeByConnectionId(conn.id);
        num--;
    });
    d.listen(12345);
    var c = ez();
    c.on('connect',function(remote,conn) {
        num--;    
        allDone.emit('done');
    });
    c.connect(12345);
});
