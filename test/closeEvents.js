// test that both client and server will respond to custom close events
// in thise case, var num = 4 means we are going to count down
// by 1 for each close event, so once for client c, once for e, and
// server d will trigger twice, so twice for server d, for a total
// of 4.

var test = require('tap').test;
var ez = require('../index');
var EE = require('events').EventEmitter;

test('connectEvents',function(t) {
    t.plan(1);
    var d = ez();
    var num = 4;
    var allDone = new EE;
    allDone.on('done',function() {
        t.equal(0, num);
        d.close();
        t.end();
    });
    d.on('connect',function(remote,conn) {
        d.closeByConnectionId(conn.id);
    });
    d.on('end',function() {
        num--;
    });
    d.listen(12345);
    var c = ez();
    c.on('end',function(remote,conn) {
        num--;    
    });
    c.connect(12345);
    var e = ez();
    e.on('end',function(remote,conn) {
        num--;    
        allDone.emit('done');
    });
    e.connect(12345);
});
