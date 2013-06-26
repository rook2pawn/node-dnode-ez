var dz = require('../');
var ez = new dz;
var ee = require('events').EventEmitter;
var foo = new ee;
foo.on('boom',function(obj) {
    console.log(obj.foo * 2); // 84
});
ez.route('foo',foo);
ez.listen(5000);
