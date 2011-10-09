var connect = require('connect');
var browserify = require('browserify');
var dnode_ez = require('dnode-ez');

var webapp = connect.createServer();
webapp.use(connect.static(__dirname));
webapp.use(browserify({
    require : ['dnode-ez','events'],
    mount : '/browserify.js'
}));

var server = dnode_ez({
    foo : function() {
        console.log("Foo, foo, FOO!!");
    }
});
server.listen(webapp);
webapp.listen(5000);
server.on('connect',function(remote,conn) {
    console.log("Someone connected: "  + conn.id);
});
server.on('omg',function(val) {
    console.log("Oh em gee : "  + val);
});
server.on('bind',function(id,remote,conn) {
    console.log("Binding! id: " + id);
    var emitter = server.getEmitterByConnId(conn.id);
    emitter.emit(id,'A message Brought To you by The Server');
});
