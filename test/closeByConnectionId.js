var ez = require('../index');
var test = require('tap').test;
test('connect',function(t) {
    t.plan(2);
    var d = ez();
    var numCloses = 0;
    d.on('connect',function(remote,conn) {
        d.closeByConnectionId(conn.id);
    });
    d.listen(12345);
    var c = ez();
    c.on('end',function(remote,conn) {
        numCloses++; 
        t.equal(numCloses, 2);
        d.close();
        t.end();
    });
    var e = ez();
    e.on('end',function(remote,conn) {
        numCloses++; 
        t.equal(numCloses, 1);
    });
    e.connect(12345);
    c.connect(12345);
     
});
