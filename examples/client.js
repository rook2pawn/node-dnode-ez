var dz = require('../');
var ee = require('events').EventEmitter;
var foo = new ee;
var ez = new dz;
ez.route(foo,'foo');
ez.connect(5000,function() {
    foo.emit('boom',{foo:42});
});
