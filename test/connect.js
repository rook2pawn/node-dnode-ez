var ez = require('../index');
var test = require('tap').test;
test('connect',function(t) {
    t.plan(1);
    var d = ez();
    d.on('connect',function() {
        d.close();
        t.ok(true,1);
        t.end();
    });
    d.listen(12345);
    var c = ez();
    c.connect(12345);
});
